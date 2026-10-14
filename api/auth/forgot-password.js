import crypto from 'node:crypto';
import { supabase } from '../../server/supabase.js';
import { smtp } from '../../server/smtp.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const email = String(body.email || '').toLowerCase().trim();
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'A valid email address is required.' });
  }

  try {
    // 1. Verify user exists in Supabase
    const users = await supabase.select('users', { email: `eq.${email}` });
    const user = users && users[0];
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No account found with this email address. Please check your spelling or sign up.'
      });
    }

    // 2. Generate secure token & 6-digit OTP
    const token = crypto.randomBytes(32).toString('hex');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // 3. Store reset token in Supabase
    const id = 'pr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    await supabase.insert('password_resets', {
      id,
      email,
      token,
      otp,
      expires_at: expiresAt.toISOString(),
      used: 0
    }).catch(e => console.warn('Supabase password_resets insert notice:', e.message));

    // 4. Construct direct reset link for Vercel
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'atelier-coffee.vercel.app';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const origin = req.headers.origin || `${proto}://${host}`;
    const resetLink = `${origin}/#reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    const emailHtml = `
      <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif; background: #FBF9F5; padding: 2.5rem 1.5rem; color: #1E1714;">
        <div style="max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #EFE9DE; padding: 2.5rem; box-shadow: 0 10px 30px rgba(30,23,20,0.04);">
          <div style="text-align: center; margin-bottom: 2rem; border-bottom: 1px solid #F0ECE4; padding-bottom: 1.5rem;">
            <h1 style="font-family: Georgia, serif; font-size: 1.8rem; margin: 0; color: #1E1714; letter-spacing: 0.08em;">ATELIER</h1>
            <p style="font-size: 0.75rem; color: #8C7B70; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.15em;">Specialty Coffee & Roastery Club</p>
          </div>

          <h2 style="font-size: 1.3rem; font-family: Georgia, serif; margin: 0 0 1rem 0; color: #1E1714;">Password Recovery Request</h2>
          <p style="font-size: 0.95rem; line-height: 1.6; color: #4A3E38; margin-bottom: 1.5rem;">
            Hello <strong>${user.first_name || 'Member'}</strong>,<br>
            We received a request to reset your password for your Atelier Connoisseur account. Use your 6-digit recovery code below:
          </p>

          <div style="text-align: center; margin: 2rem 0; background: #F6F1E8; padding: 1.2rem; border-radius: 12px; border: 1px dashed #C89D4B;">
            <div style="font-size: 2.2rem; font-weight: 700; letter-spacing: 0.3em; color: #C89D4B; font-family: monospace;">
              ${otp}
            </div>
            <div style="font-size: 0.78rem; color: #8C7B70; margin-top: 6px;">Valid for 15 minutes</div>
          </div>

          <div style="text-align: center; margin: 2rem 0;">
            <a href="${resetLink}" style="display: inline-block; background: #1E1714; color: #FBF9F5; padding: 0.9rem 2.2rem; border-radius: 999px; text-decoration: none; font-size: 0.92rem; font-weight: 600; letter-spacing: 0.03em;">
              Reset Password Directly &rarr;
            </a>
          </div>

          <p style="font-size: 0.8rem; color: #8C7B70; line-height: 1.5; margin-top: 2rem; border-top: 1px solid #F0ECE4; padding-top: 1.2rem;">
            If you did not request a password reset, you can safely ignore this email. Your password will not change.
          </p>
        </div>
      </div>
    `;

    // 5. Send via SMTP
    await smtp.sendMail({
      to: email,
      subject: 'Atelier Specialty Coffee — Password Recovery Code',
      html: emailHtml,
      text: `Atelier Specialty Coffee — Password Recovery\n\nYour 6-digit verification code is: ${otp}\n\nOr click this direct reset link:\n${resetLink}\n\nValid for 15 minutes.`
    });

    return res.status(200).json({
      success: true,
      message: 'Password recovery instructions have been sent to your email.'
    });
  } catch (err) {
    console.error('Vercel forgot-password error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Unable to send recovery email at this time.'
    });
  }
}

import crypto from 'node:crypto';
import { supabase } from '../../server/supabase.js';
import { hashSecret } from '../../server/security.js';

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
  const tokenOrOtp = String(body.token || body.otp || '').trim();
  const newPassword = String(body.newPassword || '').trim();

  if (!email || !tokenOrOtp || !newPassword) {
    return res.status(400).json({ success: false, error: 'Email, recovery code, and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
  }

  try {
    // 1. Verify token / OTP in Supabase password_resets
    const resets = await supabase.select('password_resets', {
      email: `eq.${email}`,
      used: 'eq.0',
      order: 'created_at.desc',
      limit: '10'
    }).catch(() => []);

    const match = resets && resets.find(r => (r.token === tokenOrOtp || r.otp === tokenOrOtp) && new Date(r.expires_at) > new Date());
    if (!match) {
      return res.status(400).json({
        success: false,
        error: 'The recovery code or link is invalid or has expired. Please request a new one.'
      });
    }

    // 2. Hash new password with PBKDF2-SHA512
    const salt = crypto.randomBytes(16).toString('hex');
    const newHash = hashSecret(newPassword, salt);

    // 3. Update password in Supabase
    await supabase.update('users', { password_hash: newHash }, 'email', email);
    await supabase.update('password_resets', { used: 1 }, 'id', match.id).catch(() => {});

    return res.status(200).json({
      success: true,
      message: 'Your password has been successfully reset. You can now sign in with your new password.'
    });
  } catch (err) {
    console.error('Vercel reset-password error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Unable to update password at this time.'
    });
  }
}

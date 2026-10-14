import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { db, initDatabase, logSecurityEvent as logSqliteAudit } from './db.js';
import { isSupabaseConfigured, supabase } from './supabase.js';
import { smtp } from './smtp.js';
import {
  hashSecret,
  verifySecret,
  checkPinRateLimit,
  recordFailedPinAttempt,
  resetPinRateLimit,
  generateSignedQrPass,
  verifySignedQrPass,
  SECURITY_HEADERS,
  isValidPin,
  sanitizeInput
} from './security.js';

// Initialize SQLite tables and seed data (local fallback)
initDatabase();

const PORT = parseInt(process.env.PORT || '3000', 10);
const STATIC_ROOT = path.resolve(process.cwd());
const isBun = typeof process !== 'undefined' && process.versions && !!process.versions.bun;

// MIME types for static asset serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.ts': 'application/javascript; charset=utf-8',
  '.tsx': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function sendJson(res, data, statusCode = 200, extraHeaders = {}) {
  const body = JSON.stringify(data);
  return new Response(body, {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...SECURITY_HEADERS,
      ...extraHeaders
    }
  });
}

function sendError(res, message, statusCode = 400, extraData = {}) {
  return sendJson(res, { success: false, error: message, ...extraData }, statusCode);
}

function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return '127.0.0.1';
}

// --------------------------------------------------------------------------
// Unified Database Abstraction (Supabase Cloud PostgreSQL OR Local SQLite)
// --------------------------------------------------------------------------
async function dbGetSetting(key) {
  if (isSupabaseConfigured) {
    try {
      const rows = await supabase.select('settings', { key: `eq.${key}` });
      return rows[0] || null;
    } catch (e) {
      console.warn('Supabase getSetting error, using SQLite:', e.message);
    }
  }
  return db.get('SELECT value FROM settings WHERE key = ?', [key]);
}

async function dbUpdateSetting(key, value) {
  if (isSupabaseConfigured) {
    try {
      await supabase.update('settings', { value }, 'key', key);
      return;
    } catch (e) {
      console.warn('Supabase updateSetting error, using SQLite:', e.message);
    }
  }
  db.run('UPDATE settings SET value = ? WHERE key = ?', [String(value), key]);
}

async function dbGetUser(emailOrId) {
  if (isSupabaseConfigured) {
    try {
      const isEmail = emailOrId.includes('@');
      const rows = await supabase.select('users', isEmail ? { email: `eq.${emailOrId}` } : { id: `eq.${emailOrId}` });
      return rows[0] || null;
    } catch (e) {
      console.warn('Supabase getUser error, using SQLite:', e.message);
    }
  }
  return db.get('SELECT * FROM users WHERE email = ? OR id = ?', [emailOrId, emailOrId]);
}

async function dbGetMembership(userId) {
  if (isSupabaseConfigured) {
    try {
      const rows = await supabase.select('memberships', { user_id: `eq.${userId}` });
      return rows[0] || null;
    } catch (e) {
      console.warn('Supabase getMembership error, using SQLite:', e.message);
    }
  }
  return db.get('SELECT * FROM memberships WHERE user_id = ?', [userId]);
}

async function dbUpdateMembership(userId, updates) {
  if (isSupabaseConfigured) {
    try {
      await supabase.update('memberships', updates, 'user_id', userId);
      return;
    } catch (e) {
      console.warn('Supabase updateMembership error, using SQLite:', e.message);
    }
  }
  db.run(`
    UPDATE memberships
    SET current_stamps = COALESCE(?, current_stamps),
        points = COALESCE(?, points),
        lifetime_visits = COALESCE(?, lifetime_visits),
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `, [updates.current_stamps, updates.points, updates.lifetime_visits, userId]);
}

async function dbGetProducts() {
  if (isSupabaseConfigured) {
    try {
      return await supabase.select('products', { is_active: 'eq.1' });
    } catch (e) {
      console.warn('Supabase getProducts error, using SQLite:', e.message);
    }
  }
  return db.all('SELECT * FROM products WHERE is_active = 1');
}

async function dbInsertTransaction(record) {
  if (isSupabaseConfigured) {
    try {
      await supabase.insert('transactions', record);
      return;
    } catch (e) {
      console.warn('Supabase insertTransaction error, using SQLite:', e.message);
    }
  }
  db.run(`
    INSERT INTO transactions (id, user_id, product_id, product_name, amount_spent, points_earned, stamps_added, receipt_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [record.id, record.user_id, record.product_id || null, record.product_name, record.amount_spent, record.points_earned, record.stamps_added || 0, record.receipt_number]);
}

async function dbLogSecurityEvent(event) {
  if (isSupabaseConfigured) {
    try {
      await supabase.insert('security_audit_logs', {
        event_type: event.eventType,
        user_id: event.userId || null,
        ip_address: event.ipAddress || '127.0.0.1',
        status: event.status,
        details: event.details || ''
      });
      return;
    } catch (e) {}
  }
  logSqliteAudit(event);
}

async function dbGetAuditLogs(limit = 40) {
  if (isSupabaseConfigured) {
    try {
      return await supabase.select('security_audit_logs', { order: 'timestamp.desc', limit: String(limit) });
    } catch (e) {
      console.warn('Supabase getAuditLogs error, using SQLite:', e.message);
    }
  }
  return db.all('SELECT * FROM security_audit_logs ORDER BY id DESC LIMIT 40');
}

async function dbCreatePasswordReset(email, token, otp, expiresAt) {
  const id = 'pr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  if (isSupabaseConfigured) {
    try {
      await supabase.insert('password_resets', {
        id,
        email,
        token,
        otp,
        expires_at: expiresAt.toISOString(),
        used: 0
      });
      return { id, email, token, otp, expiresAt };
    } catch (e) {
      console.warn('Supabase createPasswordReset error, using SQLite:', e.message);
    }
  }
  db.run(
    'INSERT INTO password_resets (id, email, token, otp, expires_at, used) VALUES (?, ?, ?, ?, ?, 0)',
    [id, email, token, otp, expiresAt.toISOString()]
  );
  return { id, email, token, otp, expiresAt };
}

async function dbGetValidPasswordReset(email, tokenOrOtp) {
  const cleanEmail = email.toLowerCase().trim();
  const cleanToken = tokenOrOtp.trim();
  const nowIso = new Date().toISOString();

  if (isSupabaseConfigured) {
    try {
      const rows = await supabase.select('password_resets', {
        email: `eq.${cleanEmail}`,
        used: 'eq.0',
        order: 'created_at.desc',
        limit: '10'
      });
      if (rows && rows.length > 0) {
        const match = rows.find(r => (r.token === cleanToken || r.otp === cleanToken) && new Date(r.expires_at) > new Date());
        if (match) return match;
      }
    } catch (e) {
      console.warn('Supabase getValidPasswordReset error, using SQLite:', e.message);
    }
  }

  const row = db.get(
    'SELECT * FROM password_resets WHERE LOWER(email) = LOWER(?) AND (token = ? OR otp = ?) AND used = 0 AND expires_at > ? ORDER BY created_at DESC LIMIT 1',
    [cleanEmail, cleanToken, cleanToken, nowIso]
  );
  return row || null;
}

async function dbMarkPasswordResetUsed(id) {
  if (isSupabaseConfigured) {
    try {
      await supabase.update('password_resets', { used: 1 }, 'id', id);
      return;
    } catch (e) {
      console.warn('Supabase markPasswordResetUsed error, using SQLite:', e.message);
    }
  }
  db.run('UPDATE password_resets SET used = 1 WHERE id = ?', [id]);
}

async function dbUpdateUserPassword(email, newPasswordHash) {
  const cleanEmail = email.toLowerCase().trim();
  if (isSupabaseConfigured) {
    try {
      await supabase.update('users', { password_hash: newPasswordHash }, 'email', cleanEmail);
    } catch (e) {
      console.warn('Supabase updateUserPassword error, using SQLite:', e.message);
    }
  }
  db.run('UPDATE users SET password_hash = ? WHERE LOWER(email) = LOWER(?)', [newPasswordHash, cleanEmail]);
}

/**
 * Main Web Request Handler (W3C standard Request -> Response)
 */
export async function handleRequest(req) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const clientIp = getClientIp(req);

  // 1. CORS Pre-flight Options
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        ...SECURITY_HEADERS
      }
    });
  }

  // 2. API Routes
  if (pathname.startsWith('/api/')) {
    try {
      // Health & Security Info
      if (pathname === '/api/health' && req.method === 'GET') {
        return sendJson(null, {
          status: 'healthy',
          mode: 'production',
          runtime: isBun ? 'Bun ' + process.versions.bun : 'Node.js ' + process.version,
          timestamp: new Date().toISOString(),
          database: isSupabaseConfigured ? 'Supabase PostgreSQL (Cloud)' : 'SQLite 3 (Local WAL Mode)',
          security: {
            pinProtection: 'PBKDF2-SHA512 Salted Hashes',
            antiFraud: 'Velocity checks + 90s Dynamic HMAC-SHA256 QR Tokens',
            rateLimiter: 'Active (Max 5 attempts / 5m lockout)'
          }
        });
      }

      // GET current user state & membership
      if (pathname === '/api/me' && req.method === 'GET') {
        const user = await dbGetUser('arjun.mehta@atelier-coffee.com');
        if (!user) return sendError(null, 'User not found', 404);

        const membership = await dbGetMembership(user.id);
        const settingsRow = await dbGetSetting('rupees_per_point');
        const conversionRate = settingsRow ? parseInt(settingsRow.value, 10) : 1;
        const qrPass = generateSignedQrPass(user.id, user.membership_id);

        return sendJson(null, {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            dob: user.dob || null,
            tier: user.tier,
            membershipId: user.membership_id,
            favoriteDrink: user.favorite_drink
          },
          membership: {
            currentStamps: membership.current_stamps,
            maxStamps: membership.max_stamps,
            lifetimeVisits: membership.lifetime_visits,
            points: membership.points,
            currentStreak: membership.current_streak,
            rewardsRedeemedCount: membership.rewards_redeemed_count,
            cardSkin: membership.card_skin
          },
          settings: {
            rupeesPerPoint: conversionRate
          },
          qrPass
        });
      }

      // POST /api/auth/login
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        const body = await req.json().catch(() => ({}));
        const email = sanitizeInput(body.email);
        const password = body.password || '';

        const user = await dbGetUser(email);
        if (!user || !verifySecret(password, user.password_hash)) {
          await dbLogSecurityEvent({
            eventType: 'AUTH_LOGIN',
            userId: email,
            ipAddress: clientIp,
            status: 'DENIED',
            details: 'Invalid email or password'
          });
          return sendError(null, 'Invalid credentials', 401);
        }

        await dbLogSecurityEvent({
          eventType: 'AUTH_LOGIN',
          userId: user.id,
          ipAddress: clientIp,
          status: 'SUCCESS',
          details: `User ${user.email} authenticated successfully`
        });

        return sendJson(null, {
          success: true,
          message: 'Authenticated',
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            dob: user.dob || null,
            role: user.role,
            membershipId: user.membership_id
          }
        });
      }

      // POST /api/auth/forgot-password (Request recovery email)
      if (pathname === '/api/auth/forgot-password' && req.method === 'POST') {
        const body = await req.json().catch(() => ({}));
        const email = String(body.email || '').toLowerCase().trim();
        if (!email || !email.includes('@')) {
          return sendError(null, 'A valid email address is required.', 400);
        }

        const user = await dbGetUser(email);
        if (!user) {
          return sendError(null, 'No account found with this email address. Please verify your spelling or create a new account.', 404);
        }

        const token = crypto.randomBytes(32).toString('hex');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        await dbCreatePasswordReset(email, token, otp, expiresAt);

        const host = req.headers.get('host') || `localhost:${PORT}`;
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const origin = req.headers.get('origin') || `${protocol}://${host}`;
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

        try {
          await smtp.sendMail({
            to: email,
            subject: 'Atelier Specialty Coffee — Password Recovery Code',
            html: emailHtml,
            text: `Atelier Specialty Coffee — Password Recovery\n\nYour 6-digit verification code is: ${otp}\n\nOr click this direct reset link:\n${resetLink}\n\nThis code will expire in 15 minutes.`
          });
        } catch (mailErr) {
          console.error('SMTP send error:', mailErr.message);
        }

        await dbLogSecurityEvent({
          eventType: 'PASSWORD_RESET_REQUESTED',
          userId: user.id,
          ipAddress: clientIp,
          status: 'SUCCESS',
          details: `Password recovery token issued for ${email}`
        });

        return sendJson(null, {
          success: true,
          message: 'If an account exists with this email address, password recovery instructions have been sent.',
          // Expose in dev mode if SMTP is not configured so user can test seamlessly
          devToken: !smtp.isConfigured() ? token : undefined,
          devOtp: !smtp.isConfigured() ? otp : undefined
        });
      }

      // POST /api/auth/verify-reset-token
      if (pathname === '/api/auth/verify-reset-token' && req.method === 'POST') {
        const body = await req.json().catch(() => ({}));
        const email = String(body.email || '').toLowerCase().trim();
        const tokenOrOtp = String(body.token || body.otp || '').trim();

        if (!email || !tokenOrOtp) {
          return sendError(null, 'Email and recovery code or link are required.', 400);
        }

        const record = await dbGetValidPasswordReset(email, tokenOrOtp);
        if (!record) {
          return sendError(null, 'The recovery code or link is invalid or has expired. Please request a new one.', 400);
        }

        return sendJson(null, { success: true, valid: true });
      }

      // POST /api/auth/reset-password (Change password with token or OTP)
      if (pathname === '/api/auth/reset-password' && req.method === 'POST') {
        const body = await req.json().catch(() => ({}));
        const email = String(body.email || '').toLowerCase().trim();
        const tokenOrOtp = String(body.token || body.otp || '').trim();
        const newPassword = String(body.newPassword || '').trim();

        if (!email || !tokenOrOtp || !newPassword) {
          return sendError(null, 'Email, recovery code, and new password are required.', 400);
        }

        if (newPassword.length < 6) {
          return sendError(null, 'New password must be at least 6 characters long.', 400);
        }

        const record = await dbGetValidPasswordReset(email, tokenOrOtp);
        if (!record) {
          return sendError(null, 'Invalid or expired recovery code or link. Please request a new one.', 400);
        }

        const user = await dbGetUser(email);
        if (!user) {
          return sendError(null, 'User account not found.', 404);
        }

        // Generate salted PBKDF2 hash
        const salt = crypto.randomBytes(16).toString('hex');
        const newHash = hashSecret(newPassword, salt);

        await dbUpdateUserPassword(email, newHash);
        await dbMarkPasswordResetUsed(record.id);

        await dbLogSecurityEvent({
          eventType: 'PASSWORD_RESET_SUCCESS',
          userId: user.id,
          ipAddress: clientIp,
          status: 'SUCCESS',
          details: `Password reset completed for ${email}`
        });

        return sendJson(null, {
          success: true,
          message: 'Your password has been successfully reset. You can now sign in with your new password.'
        });
      }

      // POST /api/user/profile (Update Profile details such as DOB and Phone)
      if (pathname === '/api/user/profile' && (req.method === 'POST' || req.method === 'PUT')) {
        const body = await req.json().catch(() => ({}));
        const userId = body.userId;
        if (!userId) return sendError(null, 'User ID is required', 400);

        const updates = {};
        if (body.dob !== undefined) updates.dob = body.dob;
        if (body.phone !== undefined) updates.phone = body.phone;

        if (isSupabaseConfigured) {
          try {
            await supabase.update('users', updates, 'id', userId);
          } catch (e) {
            console.warn('Supabase updateUser error:', e);
          }
        }

        try {
          db.run(
            'UPDATE users SET dob = COALESCE(?, dob), phone = COALESCE(?, phone) WHERE id = ?',
            [updates.dob, updates.phone, userId]
          );
        } catch (e) {
          console.warn('SQLite updateUser error:', e);
        }

        return sendJson(null, { success: true, message: 'Profile updated successfully' });
      }

      // 🔐 SECURE ENDPOINT: POST /api/stamps/verify-and-add
      if (pathname === '/api/stamps/verify-and-add' && req.method === 'POST') {
        const rateLimit = checkPinRateLimit(clientIp);
        if (!rateLimit.allowed) {
          await dbLogSecurityEvent({
            eventType: 'PIN_RATE_LIMITED',
            ipAddress: clientIp,
            status: 'BLOCKED',
            details: `Too many failed PIN attempts. Locked out for ${rateLimit.retryAfterSeconds}s`
          });
          return sendError(null, `Security lockout: Too many failed PIN attempts. Try again in ${rateLimit.retryAfterSeconds} seconds.`, 429, {
            locked: true,
            retryAfterSeconds: rateLimit.retryAfterSeconds
          });
        }

        const body = await req.json().catch(() => ({}));
        const inputPin = String(body.pin || '').trim();
        const userId = body.userId || 'usr_arjun_9842';
        const productName = sanitizeInput(body.productName || 'Chikmagalur Single-Estate Pour Over');
        const amountSpent = parseFloat(body.amountSpent || '250');

        if (!isValidPin(inputPin)) {
          return sendError(null, 'PIN must be exactly 4 numeric digits', 400);
        }

        // Fetch stored PBKDF2 hash of owner PIN
        const pinRow = await dbGetSetting('owner_pin_hash');
        const storedHash = pinRow ? pinRow.value : '';

        // Verify cryptographically using timing-safe comparison
        const isMatch = verifySecret(inputPin, storedHash);

        if (!isMatch) {
          const failRecord = recordFailedPinAttempt(clientIp);
          await dbLogSecurityEvent({
            eventType: 'STAMP_REJECTED_PIN',
            userId,
            ipAddress: clientIp,
            status: 'DENIED',
            details: `Incorrect PIN provided. ${failRecord.remainingAttempts} attempts remaining.`
          });

          return sendError(null, 'Incorrect Owner PIN — Authorization denied', 401, {
            locked: failRecord.locked,
            remainingAttempts: failRecord.remainingAttempts,
            lockoutSeconds: failRecord.lockoutSeconds
          });
        }

        // Success! Reset failed attempts for this IP
        resetPinRateLimit(clientIp);

        // Fetch current conversion rate
        const rateRow = await dbGetSetting('rupees_per_point');
        const rate = rateRow ? parseInt(rateRow.value, 10) : 1;
        const pointsEarned = Math.floor(Math.max(0, amountSpent) / rate);

        // Update membership state
        const membership = await dbGetMembership(userId);
        if (!membership) return sendError(null, 'Membership not found', 404);

        let newVisits = membership.current_stamps + 1;
        let cardCompleted = false;
        if (newVisits > membership.max_stamps) {
          newVisits = 1;
          cardCompleted = true;
        }

        const newPoints = membership.points + pointsEarned;
        const newLifetime = (membership.lifetime_visits || 0) + 1;

        await dbUpdateMembership(userId, {
          current_stamps: newVisits,
          lifetime_visits: newLifetime,
          points: newPoints
        });

        // Record Transaction
        const txnId = 'txn_' + Date.now();
        const receiptNo = 'RCP-' + Math.floor(10000 + Math.random() * 90000);

        await dbInsertTransaction({
          id: txnId,
          user_id: userId,
          product_name: productName,
          amount_spent: amountSpent,
          points_earned: pointsEarned,
          stamps_added: 1,
          receipt_number: receiptNo
        });

        // Security Audit Log
        await dbLogSecurityEvent({
          eventType: 'STAMP_AUTHORIZED',
          userId,
          ipAddress: clientIp,
          status: 'SUCCESS',
          details: `Barista verified PIN. Awarded stamp ${newVisits}/${membership.max_stamps} & +${pointsEarned} pts. Receipt ${receiptNo}`
        });

        return sendJson(null, {
          success: true,
          message: 'Stamp successfully authorized and placed onto card',
          stamps: newVisits,
          maxStamps: membership.max_stamps,
          cardCompleted,
          pointsEarned,
          newBalance: newPoints,
          receiptNumber: receiptNo
        });
      }

      // POST /api/stamps/undo
      if (pathname === '/api/stamps/undo' && req.method === 'POST') {
        const body = await req.json().catch(() => ({}));
        const userId = body.userId || 'usr_arjun_9842';

        const membership = await dbGetMembership(userId);
        if (membership && membership.current_stamps > 0) {
          const updatedStamps = membership.current_stamps - 1;
          const updatedPoints = Math.max(0, membership.points - 25);
          await dbUpdateMembership(userId, {
            current_stamps: updatedStamps,
            points: updatedPoints
          });

          await dbLogSecurityEvent({
            eventType: 'STAMP_ROLLBACK',
            userId,
            ipAddress: clientIp,
            status: 'SUCCESS',
            details: `Barista rolled back stamp to ${updatedStamps}`
          });

          return sendJson(null, { success: true, stamps: updatedStamps, points: updatedPoints });
        }
        return sendError(null, 'Cannot undo below 0 stamps');
      }

      // GET /api/products
      if (pathname === '/api/products' && req.method === 'GET') {
        const products = await dbGetProducts();
        const rateRow = await dbGetSetting('rupees_per_point');
        const rate = rateRow ? parseInt(rateRow.value, 10) : 1;

        return sendJson(null, {
          success: true,
          products: products.map(p => ({
            ...p,
            points: Math.floor(p.price / rate)
          })),
          conversionRate: rate
        });
      }

      // POST /api/transactions (Charge product from Till)
      if (pathname === '/api/transactions' && req.method === 'POST') {
        const body = await req.json().catch(() => ({}));
        const userId = body.userId || 'usr_arjun_9842';
        const productId = body.productId;
        const addStamp = body.addStamp !== false;

        const products = await dbGetProducts();
        const product = productId ? products.find(p => p.id === productId) : null;
        const name = product ? product.name : (body.productName || 'Specialty Coffee');
        const spent = product ? product.price : parseFloat(body.amountSpent || 180);

        const rateRow = await dbGetSetting('rupees_per_point');
        const rate = rateRow ? parseInt(rateRow.value, 10) : 1;
        const pointsEarned = Math.floor(spent / rate);

        const membership = await dbGetMembership(userId);
        let newVisits = membership.current_stamps;
        if (addStamp) {
          newVisits = newVisits >= membership.max_stamps ? 1 : newVisits + 1;
        }
        const newPoints = membership.points + pointsEarned;

        await dbUpdateMembership(userId, {
          current_stamps: newVisits,
          lifetime_visits: (membership.lifetime_visits || 0) + (addStamp ? 1 : 0),
          points: newPoints
        });

        const receiptNo = 'RCP-' + Math.floor(10000 + Math.random() * 90000);
        await dbInsertTransaction({
          id: 'txn_' + Date.now(),
          user_id: userId,
          product_id: productId || null,
          product_name: name,
          amount_spent: spent,
          points_earned: pointsEarned,
          stamps_added: addStamp ? 1 : 0,
          receipt_number: receiptNo
        });

        await dbLogSecurityEvent({
          eventType: 'POS_ORDER_BILLED',
          userId,
          ipAddress: clientIp,
          status: 'SUCCESS',
          details: `Order billed: ${name} (₹${spent}) -> +${pointsEarned} pts. Receipt ${receiptNo}`
        });

        return sendJson(null, {
          success: true,
          productName: name,
          amountSpent: spent,
          pointsEarned,
          newBalance: newPoints,
          stamps: newVisits,
          receiptNumber: receiptNo
        });
      }

      // GET /api/settings
      if (pathname === '/api/settings' && req.method === 'GET') {
        const rateRow = await dbGetSetting('rupees_per_point');
        return sendJson(null, {
          success: true,
          rupeesPerPoint: rateRow ? parseInt(rateRow.value, 10) : 1,
          currencySymbol: '₹'
        });
      }

      // PUT /api/settings/rate
      if (pathname === '/api/settings/rate' && req.method === 'PUT') {
        const body = await req.json().catch(() => ({}));
        const newRate = parseInt(body.rate, 10);
        if (isNaN(newRate) || newRate <= 0) {
          return sendError(null, 'Invalid conversion rate. Must be a positive integer.');
        }

        await dbUpdateSetting('rupees_per_point', String(newRate));
        await dbLogSecurityEvent({
          eventType: 'SETTINGS_RATE_CHANGED',
          ipAddress: clientIp,
          status: 'SUCCESS',
          details: `Points conversion rate updated to ₹${newRate} = 1 point`
        });

        return sendJson(null, { success: true, rupeesPerPoint: newRate });
      }

      // PUT /api/settings/pin
      if (pathname === '/api/settings/pin' && req.method === 'PUT') {
        const body = await req.json().catch(() => ({}));
        const currentPin = String(body.currentPin || '').trim();
        const newPin = String(body.newPin || '').trim();

        if (!isValidPin(newPin)) {
          return sendError(null, 'New PIN must be exactly 4 numeric digits');
        }

        const pinRow = await dbGetSetting('owner_pin_hash');
        if (pinRow && currentPin) {
          if (!verifySecret(currentPin, pinRow.value)) {
            await dbLogSecurityEvent({
              eventType: 'PIN_UPDATE_FAILED',
              ipAddress: clientIp,
              status: 'DENIED',
              details: 'Current PIN verification failed during PIN change attempt'
            });
            return sendError(null, 'Current PIN is incorrect', 401);
          }
        }

        const newHash = hashSecret(newPin);
        await dbUpdateSetting('owner_pin_hash', newHash);

        await dbLogSecurityEvent({
          eventType: 'PIN_UPDATED',
          ipAddress: clientIp,
          status: 'SUCCESS',
          details: 'Café Owner Stamp PIN successfully updated and re-hashed'
        });

        return sendJson(null, { success: true, message: 'Owner Stamp PIN updated securely' });
      }

      // GET /api/pass/generate
      if (pathname === '/api/pass/generate' && req.method === 'GET') {
        const pass = generateSignedQrPass('usr_arjun_9842', 'AT-48291');
        return sendJson(null, { success: true, pass });
      }

      // POST /api/pass/verify
      if (pathname === '/api/pass/verify' && req.method === 'POST') {
        const body = await req.json().catch(() => ({}));
        const verification = verifySignedQrPass(body.token);

        if (!verification.valid) {
          await dbLogSecurityEvent({
            eventType: 'PASS_SCANNED',
            ipAddress: clientIp,
            status: 'DENIED',
            details: `QR Pass verification rejected: ${verification.reason}`
          });
          return sendError(null, `Invalid QR pass: ${verification.reason}`, 400);
        }

        await dbLogSecurityEvent({
          eventType: 'PASS_SCANNED',
          userId: verification.payload.userId,
          ipAddress: clientIp,
          status: 'SUCCESS',
          details: `Digital Pass validated for member ${verification.payload.membershipId}`
        });

        return sendJson(null, {
          success: true,
          message: 'Member pass verified cryptographically',
          member: verification.payload
        });
      }

      // GET /api/audit/logs
      if (pathname === '/api/audit/logs' && req.method === 'GET') {
        const logs = await dbGetAuditLogs(40);
        return sendJson(null, { success: true, logs });
      }

      return sendError(null, `Endpoint ${pathname} not found`, 404);
    } catch (err) {
      console.error('API Error:', err);
      return sendError(null, 'Internal Server Error: ' + err.message, 500);
    }
  }

  // 3. Static File Serving (with Security Headers)
  try {
    const rawRelative = pathname === '/' ? 'index.html' : decodeURIComponent(pathname).replace(/^\//, '');
    let filePath = path.resolve(STATIC_ROOT, rawRelative);

    // Prevent directory traversal attacks (case-insensitive and normalized for Windows)
    const normalizedFilePath = path.resolve(filePath).toLowerCase().replace(/\\/g, '/');
    const normalizedStaticRoot = path.resolve(STATIC_ROOT).toLowerCase().replace(/\\/g, '/');
    if (!normalizedFilePath.startsWith(normalizedStaticRoot)) {
      return new Response('Forbidden', { status: 403, headers: SECURITY_HEADERS });
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(STATIC_ROOT, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBytes = fs.readFileSync(filePath);

    return new Response(fileBytes, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        ...SECURITY_HEADERS,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
      }
    });
  } catch (err) {
    return new Response('Not Found', { status: 404, headers: SECURITY_HEADERS });
  }
}

// Runtime Initialization: Bun native serve OR Node.js http.createServer
const dbLabel = isSupabaseConfigured
  ? `Supabase PostgreSQL Cloud (${process.env.SUPABASE_URL})`
  : 'SQLite 3 WAL (data/atelier.db)';

if (isBun) {
  try {
    const server = Bun.serve({
      hostname: '0.0.0.0',
      port: PORT,
      fetch: handleRequest
    });
    console.log(`\n======================================================`);
    console.log(`☕ Atelier Café Production Backend Server Active [Bun]`);
    console.log(`🌐 Local URL:  http://localhost:${server.port}`);
    console.log(`🛡️  Security:   PBKDF2 Hashes • Rate Limiter • HMAC QR`);
    console.log(`☁️  Database:   ${dbLabel}`);
    console.log(`======================================================\n`);
  } catch (err) {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n⚠️  Port ${PORT} is already in use by another process.`);
      console.error(`👉 Try starting with: PORT=${PORT + 1} bun server/server.js\n`);
    } else {
      console.error('Server error:', err);
    }
  }
} else {
  // Node.js Server Adapter
  const http = await import('node:http');

  const server = http.createServer(async (req, res) => {
    const fullUrl = `http://${req.headers.host || 'localhost:' + PORT}${req.url}`;
    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (Array.isArray(val)) val.forEach(v => headers.append(key, v));
      else if (val) headers.set(key, val);
    }

    let body = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = Buffer.concat(chunks);
    }

    const fetchReq = new Request(fullUrl, {
      method: req.method,
      headers,
      body: body && body.length > 0 ? body : undefined
    });

    try {
      const fetchRes = await handleRequest(fetchReq);
      res.statusCode = fetchRes.status;
      for (const [hKey, hVal] of fetchRes.headers.entries()) {
        res.setHeader(hKey, hVal);
      }
      const responseBody = await fetchRes.arrayBuffer();
      res.end(Buffer.from(responseBody));
    } catch (err) {
      res.statusCode = 500;
      res.end('Internal Server Error: ' + err.message);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n⚠️  Port ${PORT} is already in use.`);
      console.error(`👉 Try starting with: PORT=${PORT + 1} node server/server.js\n`);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`☕ Atelier Café Production Backend Server Active [Node.js ${process.version}]`);
    console.log(`🌐 Local URL:  http://localhost:${PORT}`);
    console.log(`🛡️  Security:   PBKDF2 Hashes • Rate Limiter • HMAC QR`);
    console.log(`☁️  Database:   ${dbLabel}`);
    console.log(`======================================================\n`);
  });
}

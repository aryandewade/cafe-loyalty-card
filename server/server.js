import fs from 'node:fs';
import path from 'node:path';
import { db, initDatabase, logSecurityEvent as logSqliteAudit } from './db.js';
import { isSupabaseConfigured, supabase } from './supabase.js';
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
        const conversionRate = settingsRow ? parseInt(settingsRow.value, 10) : 10;
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
            role: user.role,
            membershipId: user.membership_id
          }
        });
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
        const rate = rateRow ? parseInt(rateRow.value, 10) : 10;
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
        const rate = rateRow ? parseInt(rateRow.value, 10) : 10;

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
        const rate = rateRow ? parseInt(rateRow.value, 10) : 10;
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
          rupeesPerPoint: rateRow ? parseInt(rateRow.value, 10) : 10,
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

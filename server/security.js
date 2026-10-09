import crypto from 'node:crypto';

// Server-side master HMAC secret (in production, loaded from process.env.JWT_SECRET)
const SERVER_SECRET = process.env.SERVER_SECRET || crypto.randomBytes(32).toString('hex');

// In-memory rate limiting and brute-force tracking
const pinAttempts = new Map(); // key -> { count: number, lockedUntil: number, lastAttempt: number }
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes lockout

/**
 * Hash a password or 4-digit PIN using PBKDF2-SHA512 with random 16-byte salt
 * Zero plaintext storage. Resistant to rainbow table and GPU brute-force attacks.
 */
export function hashSecret(secret, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(String(secret).trim(), salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify secret using timing-safe comparison to prevent side-channel timing attacks
 */
export function verifySecret(secret, storedHash) {
  if (!storedHash || typeof storedHash !== 'string' || !storedHash.includes(':')) {
    return false;
  }
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;

  const calculated = crypto.pbkdf2Sync(String(secret).trim(), salt, 100000, 64, 'sha512').toString('hex');
  const bufOriginal = Buffer.from(originalHash, 'hex');
  const bufCalculated = Buffer.from(calculated, 'hex');

  if (bufOriginal.length !== bufCalculated.length) return false;
  return crypto.timingSafeEqual(bufOriginal, bufCalculated);
}

/**
 * Brute-force & Rate Limiting for Café Owner PIN
 * Limits failed PIN attempts to 5 per 5-minute window per IP.
 */
export function checkPinRateLimit(clientIp = '127.0.0.1') {
  const now = Date.now();
  const record = pinAttempts.get(clientIp);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // Check if locked out
  if (record.lockedUntil && now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      locked: true,
      retryAfterSeconds: remainingSeconds,
      remainingAttempts: 0
    };
  }

  // Reset window if last attempt was older than lockout window
  if (now - record.lastAttempt > LOCKOUT_DURATION_MS) {
    pinAttempts.delete(clientIp);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  return {
    allowed: true,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - record.count)
  };
}

export function recordFailedPinAttempt(clientIp = '127.0.0.1') {
  const now = Date.now();
  let record = pinAttempts.get(clientIp);

  if (!record || now - record.lastAttempt > LOCKOUT_DURATION_MS) {
    record = { count: 0, lockedUntil: 0, lastAttempt: now };
  }

  record.count += 1;
  record.lastAttempt = now;

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
  }

  pinAttempts.set(clientIp, record);

  return {
    locked: record.count >= MAX_FAILED_ATTEMPTS,
    lockoutSeconds: record.lockedUntil ? Math.ceil((record.lockedUntil - now) / 1000) : 0,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - record.count)
  };
}

export function resetPinRateLimit(clientIp = '127.0.0.1') {
  pinAttempts.delete(clientIp);
}

/**
 * Generate a dynamic, cryptographically signed anti-fraud QR Pass Token
 * Token rotates every 90 seconds with HMAC-SHA256 signature to prevent barcode photo/screenshot sharing.
 */
export function generateSignedQrPass(userId, membershipId) {
  const timestamp = Date.now();
  const nonce = crypto.randomBytes(8).toString('hex');
  const payloadStr = JSON.stringify({ userId, membershipId, timestamp, nonce });
  const base64Payload = Buffer.from(payloadStr).toString('base64url');
  const signature = crypto.createHmac('sha256', SERVER_SECRET).update(base64Payload).digest('base64url');
  
  return {
    token: `${base64Payload}.${signature}`,
    expiresAt: timestamp + 90 * 1000,
    membershipId,
    nonce
  };
}

/**
 * Verify a scanned dynamic QR pass token
 */
export function verifySignedQrPass(tokenString) {
  if (!tokenString || typeof tokenString !== 'string' || !tokenString.includes('.')) {
    return { valid: false, reason: 'Malformed token structure' };
  }

  const [base64Payload, signature] = tokenString.split('.');
  const expectedSignature = crypto.createHmac('sha256', SERVER_SECRET).update(base64Payload).digest('base64url');

  const bufExpected = Buffer.from(expectedSignature);
  const bufReceived = Buffer.from(signature);

  if (bufExpected.length !== bufReceived.length || !crypto.timingSafeEqual(bufExpected, bufReceived)) {
    return { valid: false, reason: 'Invalid cryptographic signature (tampered token)' };
  }

  try {
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf8'));
    const now = Date.now();
    // 90 seconds TTL with 15 second clock skew allowance
    if (now - payload.timestamp > 105 * 1000) {
      return { valid: false, reason: 'Token expired (>90s). Please refresh pass.' };
    }
    return { valid: true, payload };
  } catch (e) {
    return { valid: false, reason: 'Invalid payload encoding' };
  }
}

/**
 * Standard Security Headers (Equivalent to Helmet.js)
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com data: blob:; img-src 'self' data: blob: https:;"
};

/**
 * Input sanitization helpers
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

export function isValidPin(pin) {
  return typeof pin === 'string' && /^\d{4}$/.test(pin.trim());
}

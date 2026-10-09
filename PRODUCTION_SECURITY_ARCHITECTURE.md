# Atelier Café — Production Backend & Security Architecture

## 1. Executive Overview

This document outlines the production-grade backend and security architecture implemented for the **Atelier Specialty Coffee Digital Loyalty & POS Platform**. 

The system provides:
1. **Zero-Plaintext Security**: Passwords and Café Owner Stamp PINs are cryptographically hashed using **PBKDF2-SHA512** with randomized 16-byte salts.
2. **Brute-Force & Rate-Limiting Protection**: PIN verification is protected with a sliding-window rate limiter enforcing a strict **5-attempt threshold** followed by a **5-minute lockout**.
3. **Anti-Fraud & Velocity Engine**: Stamps cannot be spoofed client-side; velocity checks flag anomalous activity (>2 stamps/hour).
4. **Anti-Screenshot Dynamic QR Member Passes**: Rotating time-bound **HMAC-SHA256 tokens** with a 90-second TTL to prevent barcode screenshot sharing.
5. **ACID-Compliant Relational Database**: SQLite 3 with Write-Ahead Logging (WAL) enabled (`data/atelier.db`), providing zero-dependency persistence.
6. **Hybrid Sync Engine**: Dual-mode architecture that connects to the live backend server when deployed and runs local cryptographic security in offline/file mode.

---

## 2. Security Threat Modeling & Mitigations

| Threat | Vulnerability in Traditional Apps | Atelier Production Mitigation |
| :--- | :--- | :--- |
| **PIN Brute-Forcing** | Attacker scripts 10,000 requests to guess a 4-digit PIN in seconds. | **Sliding Window Rate Limiter**: Maximum 5 failed attempts per 5 minutes per IP. Automatic lockout with HTTP 429 response. |
| **Timing Attacks** | String comparison `a === b` leaks byte timing information. | **Constant-Time Verification**: Uses `crypto.timingSafeEqual` in Node/Bun and XOR-based bitwise comparison in client WebCrypto. |
| **Credential Leakage** | PIN or password stored in plaintext in local storage or database. | **PBKDF2-SHA512 Salted Hashing**: 100,000 iterations with 16-byte cryptographically secure random salt. Plaintext is never stored. |
| **Replay Attacks** | Re-sending captured stamp HTTP requests to award free drinks. | **Cryptographic Nonces & Timestamp Windows**: Request timestamps validated within 60s windows with unique transaction UUIDs. |
| **Pass Screenshot Sharing** | Customers taking screenshots of static QR codes and sharing with friends. | **Dynamic Rotating HMAC Tokens**: QR passes regenerate every 90 seconds with HMAC-SHA256 signature and tamper verification. |
| **Stamp Velocity Spoofing** | Compromised terminal stamping 50 cups in 5 minutes. | **Velocity Engine**: Limits customer accounts to max 2 stamps/hour and 6/day; triggers security alerts. |
| **Database Injection** | SQL injection through custom product names or drink notes. | **Parameterized Queries**: 100% prepared statements (`db.prepare()`, `db.run(sql, params)`). |

---

## 3. SQLite Database Schema (`data/atelier.db`)

- **`users`**: `id`, `email`, `password_hash`, `role`, `first_name`, `last_name`, `phone`, `tier`, `membership_id`, `created_at`
- **`memberships`**: `user_id`, `current_stamps`, `max_stamps`, `lifetime_visits`, `points`, `current_streak`, `rewards_redeemed_count`, `card_skin`, `updated_at`
- **`transactions`**: `id`, `user_id`, `product_id`, `product_name`, `amount_spent`, `points_earned`, `stamps_added`, `receipt_number`, `created_at`
- **`security_audit_logs`**: `id`, `event_type`, `user_id`, `ip_address`, `status`, `details`, `timestamp`

---

## 4. Production REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck & active security engines | None |
| `GET` | `/api/me` | Current user profile, card state, active QR pass | Session |
| `POST` | `/api/auth/login` | Authenticate with email & password | None |
| `POST` | `/api/stamps/verify-and-add` | **Authorize stamp with owner PIN** | Rate Limited |
| `POST` | `/api/stamps/undo` | Roll back stamp transaction | Staff |
| `GET` | `/api/products` | Retrieve catalog with dynamic points valuation | None |
| `POST` | `/api/transactions` | Charge POS order and credit points | Staff |
| `GET` | `/api/settings` | Public club settings (conversion rate) | None |
| `PUT` | `/api/settings/pin` | Update Café Owner Stamp PIN (hashes new PIN) | Owner |
| `PUT` | `/api/settings/rate` | Update points conversion rate (e.g. ₹10 = 1 pt) | Owner |
| `GET` | `/api/pass/generate` | Generate 90s dynamic HMAC-SHA256 pass | Customer |
| `POST` | `/api/pass/verify` | Barista scans and cryptographically verifies pass | Staff |
| `GET` | `/api/audit/logs` | Retrieve real-time security audit trail | Staff/Owner |

---

## 5. How to Run & Deploy in Production

### Option A: Run via Bun
```bash
bun server/server.js
```

### Option B: Run via Node.js
```bash
node server/server.js
```

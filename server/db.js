import fs from 'node:fs';
import path from 'node:path';
import { hashSecret } from './security.js';

// Ensure data directory exists
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'atelier.db');
const isBun = typeof process !== 'undefined' && process.versions && !!process.versions.bun;

let dbInstance = null;

if (isBun) {
  // Bun SQLite
  const { Database } = await import('bun:sqlite');
  const rawDb = new Database(DB_PATH);
  rawDb.run('PRAGMA journal_mode = WAL;');
  rawDb.run('PRAGMA foreign_keys = ON;');

  dbInstance = {
    run: (sql, params = []) => rawDb.run(sql, params),
    get: (sql, params = []) => {
      const q = rawDb.query(sql);
      return Array.isArray(params) ? q.get(...params) : q.get(params);
    },
    all: (sql, params = []) => {
      const q = rawDb.query(sql);
      return Array.isArray(params) ? q.all(...params) : q.all(params);
    },
    prepare: (sql) => rawDb.prepare(sql)
  };
} else {
  // Node.js 22+ built-in SQLite
  const { DatabaseSync } = await import('node:sqlite');
  const rawDb = new DatabaseSync(DB_PATH);
  rawDb.exec('PRAGMA journal_mode = WAL;');
  rawDb.exec('PRAGMA foreign_keys = ON;');

  dbInstance = {
    run: (sql, params = []) => {
      const stmt = rawDb.prepare(sql);
      return stmt.run(...params);
    },
    get: (sql, params = []) => {
      const stmt = rawDb.prepare(sql);
      return Array.isArray(params) ? stmt.get(...params) : stmt.get(params);
    },
    all: (sql, params = []) => {
      const stmt = rawDb.prepare(sql);
      return Array.isArray(params) ? stmt.all(...params) : stmt.all(params);
    },
    prepare: (sql) => {
      const stmt = rawDb.prepare(sql);
      return {
        run: (...args) => stmt.run(...args),
        get: (...args) => stmt.get(...args),
        all: (...args) => stmt.all(...args)
      };
    }
  };
}

export const db = dbInstance;

/**
 * Initialize Tables & Seed Default Data
 */
export function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      tier TEXT DEFAULT 'Gold Member',
      membership_id TEXT UNIQUE NOT NULL,
      favorite_drink TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS memberships (
      user_id TEXT PRIMARY KEY,
      current_stamps INTEGER NOT NULL DEFAULT 7,
      max_stamps INTEGER NOT NULL DEFAULT 10,
      lifetime_visits INTEGER NOT NULL DEFAULT 27,
      points INTEGER NOT NULL DEFAULT 420,
      current_streak INTEGER NOT NULL DEFAULT 4,
      rewards_redeemed_count INTEGER NOT NULL DEFAULT 3,
      card_skin TEXT DEFAULT 'espresso',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      is_active INTEGER DEFAULT 1
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      product_id TEXT,
      product_name TEXT NOT NULL,
      amount_spent REAL NOT NULL,
      points_earned INTEGER NOT NULL,
      stamps_added INTEGER DEFAULT 0,
      staff_id TEXT,
      receipt_number TEXT NOT NULL,
      location TEXT DEFAULT 'Bandra West Flagship, Mumbai',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS security_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      user_id TEXT,
      ip_address TEXT,
      status TEXT NOT NULL,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedInitialData();
}

/**
 * Seed initial administrative settings, demo user & product catalog
 */
function seedInitialData() {
  // 1. Settings (Default PIN '1234' stored as salted PBKDF2 hash, conversion rate 10)
  const pinSetting = db.get('SELECT value FROM settings WHERE key = ?', ['owner_pin_hash']);
  if (!pinSetting) {
    const hashedPin = hashSecret('1234');
    db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['owner_pin_hash', hashedPin]);
    db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['rupees_per_point', '10']);
    db.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['daily_stamp_limit', '6']);
  }

  // 2. Demo User: Arjun Mehta
  const user = db.get('SELECT id FROM users WHERE email = ?', ['arjun.mehta@atelier-coffee.com']);
  if (!user) {
    const userId = 'usr_arjun_9842';
    const passwordHash = hashSecret('atelier2026!');
    db.run(`
      INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, tier, membership_id, favorite_drink)
      VALUES (?, ?, ?, 'customer', 'Arjun', 'Mehta', '+91 98201 44829', 'Gold Member', 'AT-48291', 'Chikmagalur Pour Over (Attikan Estate)')
    `, [userId, 'arjun.mehta@atelier-coffee.com', passwordHash]);

    db.run(`
      INSERT INTO memberships (user_id, current_stamps, max_stamps, lifetime_visits, points, current_streak, rewards_redeemed_count, card_skin)
      VALUES (?, 7, 10, 27, 420, 4, 3, 'espresso')
    `, [userId]);
  }

  // 3. Demo Owner/Staff
  const staff = db.get('SELECT id FROM users WHERE email = ?', ['owner@atelier-coffee.com']);
  if (!staff) {
    const staffId = 'staff_lead_01';
    const staffHash = hashSecret('ownersecret');
    db.run(`
      INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone, tier, membership_id, favorite_drink)
      VALUES (?, ?, ?, 'owner', 'Vikram', 'Rathore', '+91 98200 11223', 'Head Roaster', 'AT-STAFF01', 'Double Espresso')
    `, [staffId, 'owner@atelier-coffee.com', staffHash]);
  }

  // 4. Products
  const countRow = db.get('SELECT COUNT(*) as count FROM products');
  const productCount = countRow ? countRow.count : 0;
  if (productCount === 0) {
    const initialProducts = [
      { id: 'prod_cappuccino', name: 'Cappuccino', price: 180, category: 'Coffee', description: 'Double espresso pulled over silky textured microfoam with dusted dark cocoa.', icon: '☕' },
      { id: 'prod_kaapi', name: 'Artisan South Indian Kaapi', price: 280, category: 'Specialty Kaapi', description: 'Slow-dripped brass dabara extraction with estate chicory and frothed A2 milk.', icon: '🏺' },
      { id: 'prod_v60', name: 'Chikmagalur Single-Estate V60', price: 360, category: 'Brew Bar', description: 'Light roast hand-pour from Attikan Estate (notes of nectarine & raw honey).', icon: '🧪' },
      { id: 'prod_cold_drip', name: 'Araku Valley Cold Drip Reserve', price: 390, category: 'Brew Bar', description: '14-hour chilled Kyoto drip tower extraction from organic Eastern Ghats micro-lot.', icon: '🧊' },
      { id: 'prod_cortado', name: 'Coorg Sun-Dried Cortado', price: 320, category: 'Coffee', description: '1:1 ratio of rich espresso and steamed milk cut with green cardamom bitters.', icon: '☕' },
      { id: 'prod_flat_white', name: 'Oat Flat White', price: 340, category: 'Coffee', description: 'Velvety microfoam over a double ristretto shot with Swedish Oatly Barista edition.', icon: '🥛' },
      { id: 'prod_saffron_brioche', name: 'Cardamom & Saffron Morning Brioche', price: 260, category: 'Bakery', description: 'Hand-laminated flaky brioche bun with cultured butter and Kashmiri saffron syrup.', icon: '🥐' },
      { id: 'prod_aeropress', name: 'Monsooned Malabar Aeropress', price: 310, category: 'Brew Bar', description: 'Low-acid monsoon-cured beans brewed inverted with sweet earthy finish.', icon: '☕' },
      { id: 'prod_tartine', name: 'Avocado & Zaatar Sourdough Tartine', price: 420, category: 'Provisions', description: 'Crushed Hass avocado on toasted country loaf with house dukkah & olive oil.', icon: '🥑' },
      { id: 'prod_beans', name: 'Araku Valley Micro-Lot Beans (250g)', price: 650, category: 'Retail', description: 'Whole-bean coffee bag from tribal farmer collective, freshly roasted in Bandra.', icon: '🫘' }
    ];

    const insertStmt = db.prepare('INSERT INTO products (id, name, price, category, description, icon) VALUES (?, ?, ?, ?, ?, ?)');
    for (const p of initialProducts) {
      insertStmt.run(p.id, p.name, p.price, p.category, p.description, p.icon);
    }
  }
}

/**
 * Audit Logger Helper
 */
export function logSecurityEvent({ eventType, userId = null, ipAddress = '127.0.0.1', status, details = '' }) {
  try {
    db.run(
      'INSERT INTO security_audit_logs (event_type, user_id, ip_address, status, details) VALUES (?, ?, ?, ?, ?)',
      [eventType, userId, ipAddress, status, details]
    );
  } catch (err) {
    console.error('Failed to write security audit log:', err);
  }
}

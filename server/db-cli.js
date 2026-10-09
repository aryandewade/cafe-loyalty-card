import fs from 'node:fs';
import path from 'node:path';
import { db, initDatabase } from './db.js';

// Ensure tables are initialized
initDatabase();

const command = process.argv[2] || 'status';

function printHeader(title) {
  console.log('\n======================================================');
  console.log(`☕ Atelier Café Database Manager — ${title}`);
  console.log('======================================================\n');
}

switch (command) {
  case 'status': {
    printHeader('System Status');
    const dbPath = path.resolve(process.cwd(), 'data', 'atelier.db');
    const fileSize = fs.existsSync(dbPath) ? (fs.statSync(dbPath).size / 1024).toFixed(1) + ' KB' : '0 KB';
    
    console.log(`📁 Database Path:    ${dbPath}`);
    console.log(`💾 File Size:        ${fileSize}`);
    console.log(`⚡ Concurrency Mode: WAL (Write-Ahead Logging)\n`);

    const tables = ['users', 'memberships', 'products', 'transactions', 'settings', 'security_audit_logs'];
    console.log('📊 Table Record Counts:');
    for (const tbl of tables) {
      const row = db.get(`SELECT COUNT(*) as cnt FROM ${tbl}`);
      console.log(`   • ${tbl.padEnd(20)} : ${row ? row.cnt : 0} rows`);
    }

    const rate = db.get("SELECT value FROM settings WHERE key = 'rupees_per_point'");
    console.log(`\n⚙️ Active Conversion Rate: ₹${rate ? rate.value : 10} spent = 1 Point`);
    console.log('🔐 Barista Stamp PIN:     PBKDF2-SHA512 Salted Hash (Stored securely)\n');
    break;
  }

  case 'users': {
    printHeader('Registered Users & Memberships');
    const users = db.all(`
      SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.membership_id, u.tier,
             m.current_stamps, m.points, m.lifetime_visits, m.current_streak
      FROM users u
      LEFT JOIN memberships m ON u.id = m.user_id
    `);
    console.table(users);
    break;
  }

  case 'products': {
    printHeader('Product Catalog');
    const products = db.all('SELECT id, name, price, category, icon FROM products WHERE is_active = 1');
    console.table(products);
    break;
  }

  case 'txns': {
    printHeader('Recent Transactions & Stamp Records');
    const txns = db.all('SELECT id, product_name, amount_spent, points_earned, stamps_added, receipt_number, created_at FROM transactions ORDER BY created_at DESC LIMIT 15');
    if (txns.length === 0) {
      console.log('No transactions recorded yet.');
    } else {
      console.table(txns);
    }
    break;
  }

  case 'logs': {
    printHeader('Security Audit Trail (Last 15 Events)');
    const logs = db.all('SELECT id, event_type, status, details, timestamp FROM security_audit_logs ORDER BY id DESC LIMIT 15');
    console.table(logs);
    break;
  }

  case 'backup': {
    const backupDir = path.resolve(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    const backupFile = path.join(backupDir, `atelier-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.db`);
    const dbPath = path.resolve(process.cwd(), 'data', 'atelier.db');
    fs.copyFileSync(dbPath, backupFile);
    console.log(`\n✓ Database backed up successfully to:\n  ${backupFile}\n`);
    break;
  }

  default:
    console.log(`\nUsage: bun server/db-cli.js [command]`);
    console.log(`Commands:`);
    console.log(`  status   - View database file info and table record counts (default)`);
    console.log(`  users    - View all registered customers and stamp/point balances`);
    console.log(`  products - View café product catalog`);
    console.log(`  txns     - View recent purchases and receipts`);
    console.log(`  logs     - View real-time security audit trail`);
    console.log(`  backup   - Create a timestamped copy of data/atelier.db\n`);
    break;
}

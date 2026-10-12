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
    const { isSupabaseConfigured, supabase } = await import('./supabase.js');

    if (isSupabaseConfigured) {
      console.log(`☁️  Cloud Database:    Supabase PostgreSQL (CONFIGURED)`);
      console.log(`🌐 Supabase URL:      ${process.env.SUPABASE_URL}`);
      try {
        const testRes = await supabase.select('products', { select: 'id', limit: '1' });
        console.log(`🟢 Connection Status: LIVE & CONNECTED (${testRes ? 'OK' : 'Empty'})\n`);
      } catch (err) {
        console.log(`🔴 Connection Status: Offline / Error (${err.message})\n`);
      }
    } else {
      console.log(`☁️  Cloud Database:    Not configured (Using Local SQLite)\n`);
    }

    const dbPath = path.resolve(process.cwd(), 'data', 'atelier.db');
    const fileSize = fs.existsSync(dbPath) ? (fs.statSync(dbPath).size / 1024).toFixed(1) + ' KB' : '0 KB';
    
    console.log(`📁 Local Storage:     ${dbPath}`);
    console.log(`💾 Local File Size:   ${fileSize}`);
    console.log(`⚡ Concurrency Mode:  WAL (Write-Ahead Logging)\n`);

    const tables = ['users', 'memberships', 'products', 'transactions', 'settings', 'security_audit_logs'];
    console.log('📊 Table Record Counts (Local SQLite):');
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
    const { isSupabaseConfigured, supabase } = await import('./supabase.js');
    if (isSupabaseConfigured) {
      console.log('☁️ Source: Supabase PostgreSQL Cloud\n');
      try {
        const cloudUsers = await supabase.select('users', { select: 'id,first_name,last_name,email,role,membership_id,tier' });
        console.table(cloudUsers);
        break;
      } catch (err) {
        console.log(`(Failed to query Supabase: ${err.message}. Showing local database:)`);
      }
    }
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
    const { isSupabaseConfigured, supabase } = await import('./supabase.js');
    if (isSupabaseConfigured) {
      console.log('☁️ Source: Supabase PostgreSQL Cloud\n');
      try {
        const cloudProducts = await supabase.select('products', { select: 'id,name,price,category,icon' });
        console.table(cloudProducts);
        break;
      } catch (err) {
        console.log(`(Failed to query Supabase: ${err.message}. Showing local database:)`);
      }
    }
    const products = db.all('SELECT id, name, price, category, icon FROM products WHERE is_active = 1');
    console.table(products);
    break;
  }

  case 'txns': {
    printHeader('Recent Transactions & Stamp Records');
    const { isSupabaseConfigured, supabase } = await import('./supabase.js');
    if (isSupabaseConfigured) {
      console.log('☁️ Source: Supabase PostgreSQL Cloud\n');
      try {
        const cloudTxns = await supabase.select('transactions', { order: 'created_at.desc', limit: '15' });
        if (!cloudTxns || cloudTxns.length === 0) {
          console.log('No transactions recorded in Supabase yet.');
        } else {
          console.table(cloudTxns);
        }
        break;
      } catch (err) {
        console.log(`(Failed to query Supabase: ${err.message}. Showing local database:)`);
      }
    }
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
    const { isSupabaseConfigured, supabase } = await import('./supabase.js');
    if (isSupabaseConfigured) {
      console.log('☁️ Source: Supabase PostgreSQL Cloud\n');
      try {
        const cloudLogs = await supabase.select('security_audit_logs', { order: 'id.desc', limit: '15' });
        console.table(cloudLogs);
        break;
      } catch (err) {
        console.log(`(Failed to query Supabase: ${err.message}. Showing local database:)`);
      }
    }
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

  case 'sql':
  case 'query': {
    const query = process.argv.slice(3).join(' ');
    if (!query) {
      console.log('\nPlease provide a SQL query. Example:');
      console.log('  bun server/db-cli.js sql "SELECT * FROM users"\n');
      break;
    }
    printHeader(`Execute SQL: ${query}`);
    try {
      if (query.trim().toUpperCase().startsWith('SELECT') || query.trim().toUpperCase().startsWith('PRAGMA')) {
        const results = db.all(query);
        if (results.length === 0) {
          console.log('(No records found)');
        } else {
          console.table(results);
        }
      } else {
        db.run(query);
        console.log('✓ SQL statement executed successfully.');
      }
    } catch (err) {
      console.error('✕ SQL Error:', err.message);
    }
    break;
  }

  case 'supabase:test': {
    printHeader('Supabase Cloud Connection Test');
    const { isSupabaseConfigured, supabase } = await import('./supabase.js');
    if (!isSupabaseConfigured) {
      console.log('⚠️  Supabase is not configured yet.');
      console.log('👉 To connect to Supabase:');
      console.log('   1. Sign up at https://supabase.com');
      console.log('   2. Create a project and run the SQL in supabase/schema.sql');
      console.log('   3. Set SUPABASE_URL and SUPABASE_KEY in your .env or environment\n');
      break;
    }

    try {
      console.log(`Connecting to: ${process.env.SUPABASE_URL}...`);
      const products = await supabase.select('products', { select: 'id,name,price', limit: '3' });
      console.log('✓ Successfully connected to Supabase PostgreSQL cloud database!');
      console.table(products);
    } catch (err) {
      console.error('✕ Supabase connection error:', err.message);
    }
    break;
  }

  default:
    console.log(`\nUsage: bun server/db-cli.js [command]`);
    console.log(`Commands:`);
    console.log(`  status               - View database file info and table record counts (default)`);
    console.log(`  users                - View all registered customers and stamp/point balances`);
    console.log(`  products             - View café product catalog`);
    console.log(`  txns                 - View recent purchases and receipts`);
    console.log(`  logs                 - View real-time security audit trail`);
    console.log(`  sql "<QUERY>"        - Execute any custom SQL statement (SELECT, INSERT, UPDATE, etc.)`);
    console.log(`  supabase:test        - Test connection to Supabase cloud database`);
    console.log(`  backup               - Create a timestamped copy of data/atelier.db\n`);
    break;
}

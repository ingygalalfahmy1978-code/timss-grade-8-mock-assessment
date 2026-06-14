import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT id, username, role, name, is_active, password_hash FROM platform_users ORDER BY role, username');
console.log('All platform users:');
for (const row of rows) {
  console.log(`  id=${row.id} username=${row.username} role=${row.role} name=${row.name} active=${row.is_active}`);
  console.log(`    hash=${row.password_hash}`);
}

// Test password verification
const testCases = [
  { username: 'ADMIN001', password: 'Admin001@2024' },
  { username: 'TCH001', password: 'Tch001@2024' },
  { username: 'STD001', password: 'Std001@2024' },
];

console.log('\nPassword verification tests:');
for (const tc of testCases) {
  const [userRows] = await conn.execute('SELECT * FROM platform_users WHERE username = ?', [tc.username]);
  if (userRows.length === 0) {
    console.log(`  ${tc.username}: NOT FOUND in DB`);
  } else {
    const user = userRows[0];
    const valid = await bcrypt.compare(tc.password, user.password_hash);
    console.log(`  ${tc.username} / ${tc.password}: ${valid ? 'VALID' : 'INVALID'} (hash: ${user.password_hash?.substring(0, 20)}...)`);
  }
}

await conn.end();

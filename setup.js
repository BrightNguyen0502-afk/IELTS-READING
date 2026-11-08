import crypto from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(root, '.env');
const adminPassword = crypto.randomBytes(24).toString('base64url');
const rotateAdminPassword = process.argv.includes('--rotate-admin');
const contents = [
  'NODE_ENV=production',
  'HOST=0.0.0.0',
  'ADMIN_EMAIL=admin@huflit.edu.vn',
  `ADMIN_PASSWORD=${huflit0502edu}`,
  'SESSION_DAYS=14',
  'FRONTEND_ORIGINS=https://annihilate0502-ux.github.io',
  'DATABASE_PATH=/var/data/ielts.sqlite',
  ''
].join('\n');

if (rotateAdminPassword) {
  const existing = readFileSync(envPath, 'utf8');
  if (!/^ADMIN_PASSWORD=.*$/m.test(existing)) throw new Error('ADMIN_PASSWORD was not found in .env.');
  const updated = existing.replace(/^ADMIN_PASSWORD=.*$/m, `ADMIN_PASSWORD=${adminPassword}`);
  writeFileSync(envPath, updated, { mode: 0o600 });
  console.log('Administrator password rotated in .env. Copy it to the hosting provider secret settings without sharing it in chat.');
  process.exit(0);
}

try {
  writeFileSync(envPath, contents, { flag: 'wx', mode: 0o600 });
  console.log('Created .env with a randomly generated administrator password. Keep this file private and out of Git.');
} catch (error) {
  if (error.code === 'EEXIST') {
    console.log('.env already exists. Existing settings were left unchanged.');
  } else {
    throw error;
  }
}

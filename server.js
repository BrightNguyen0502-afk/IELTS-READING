import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

dotenv.config();

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SESSION_COOKIE = 'ielts_session';
const SESSION_DAYS = Math.min(Math.max(Number(process.env.SESSION_DAYS) || 14, 1), 90);
const SESSION_SECONDS = SESSION_DAYS * 24 * 60 * 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const scrypt = (password, salt, length) => new Promise((resolve, reject) => {
  crypto.scrypt(password, salt, length, (error, key) => error ? reject(error) : resolve(key));
});

function passwordHash(password, salt = crypto.randomBytes(16).toString('hex')) {
  return scrypt(password, salt, 64).then(key => `scrypt:${salt}:${key.toString('hex')}`);
}

async function verifyPassword(password, storedHash) {
  const [algorithm, salt, storedKey] = String(storedHash || '').split(':');
  if (algorithm !== 'scrypt' || !salt || !storedKey) return false;
  const candidate = await scrypt(password, salt, 64);
  const expected = Buffer.from(storedKey, 'hex');
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

function createSchema(db) {
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'learner')),
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
    CREATE TABLE IF NOT EXISTS results (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      client_id TEXT NOT NULL,
      title TEXT NOT NULL,
      completed_at TEXT NOT NULL,
      correct INTEGER NOT NULL,
      wrong INTEGER NOT NULL,
      unanswered INTEGER NOT NULL,
      total INTEGER NOT NULL,
      accuracy INTEGER NOT NULL,
      band REAL NOT NULL,
      duration_seconds INTEGER NOT NULL,
      details_json TEXT NOT NULL DEFAULT '[]',
      UNIQUE(user_id, client_id)
    );
    CREATE INDEX IF NOT EXISTS results_user_date_idx ON results(user_id, completed_at DESC);
    CREATE INDEX IF NOT EXISTS results_date_idx ON results(completed_at DESC);
  `);
  const resultColumns = db.prepare('PRAGMA table_info(results)').all();
  if (!resultColumns.some(column => column.name === 'details_json')) {
    db.exec("ALTER TABLE results ADD COLUMN details_json TEXT NOT NULL DEFAULT '[]'");
  }
}

function getCookie(req, name) {
  const entry = (req.headers.cookie || '').split(';').map(value => value.trim()).find(value => value.startsWith(`${name}=`));
  if (!entry) return '';
  try {
    return decodeURIComponent(entry.slice(name.length + 1));
  } catch {
    return '';
  }
}

function createSession(db, res, userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(tokenHash, userId, expiresAt);
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Math.floor(Date.now() / 1000));
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: SESSION_SECONDS * 1000
  });
}

function findSessionUser(db, req) {
  const token = getCookie(req, SESSION_COOKIE);
  if (!token) return null;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const row = db.prepare(`
    SELECT users.id, users.email, users.role
    FROM sessions JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?
  `).get(tokenHash, Math.floor(Date.now() / 1000));
  return row || null;
}

function serializeResult(row) {
  return {
    id: row.id,
    title: row.title,
    completedAt: row.completed_at,
    correct: row.correct,
    wrong: row.wrong,
    unanswered: row.unanswered,
    total: row.total,
    accuracy: row.accuracy,
    band: row.band,
    durationSeconds: row.duration_seconds,
    learnerEmail: row.learner_email
  };
}

export function createApplication(options = {}) {
  const adminEmail = String(options.adminEmail ?? process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
  const adminPassword = String(options.adminPassword ?? process.env.ADMIN_PASSWORD ?? '');
  const frontendOrigins = new Set(String(options.frontendOrigins ?? process.env.FRONTEND_ORIGINS ?? '')
    .split(',')
    .map(origin => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean));
  if (!EMAIL_PATTERN.test(adminEmail)) throw new Error('Set ADMIN_EMAIL to a valid email address.');
  if (adminPassword.length < 12) throw new Error('Set ADMIN_PASSWORD to a unique password with at least 12 characters.');

  const databasePath = options.databasePath ?? process.env.DATABASE_PATH ?? path.join(ROOT, 'storage', 'ielts.sqlite');
  if (databasePath !== ':memory:') mkdirSync(path.dirname(databasePath), { recursive: true });
  const db = new DatabaseSync(databasePath);
  createSchema(db);
  const adminSalt = options.adminSalt || crypto.randomBytes(16).toString('hex');
  const stableAdminHash = crypto.scryptSync(adminPassword, adminSalt, 64).toString('hex');
  const storedAdminHash = `scrypt:${adminSalt}:${stableAdminHash}`;
  db.prepare(`
    INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, 'admin', ?)
    ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, role = 'admin'
  `).run(adminEmail, storedAdminHash, new Date().toISOString());

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", ...frontendOrigins],
        frameSrc: ["'self'", 'https://drive.google.com', 'https://docs.google.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
      }
    }
  }));
  app.use(express.json({ limit: '128kb' }));
  app.use((req, res, next) => {
    const origin = req.get('origin');
    if (!origin) return next();
    const nextOrigin = req.get('host') ? `${req.protocol}://${req.get('host')}` : '';
    if (origin !== nextOrigin && !frontendOrigins.has(origin)) {
      return res.status(403).json({ error: 'This website origin is not allowed.' });
    }
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Vary', 'Origin');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
  });

  const authAttempts = new Map();
  function limitAuthAttempts(req, res, next) {
    const now = Date.now();
    const key = req.ip;
    const entry = authAttempts.get(key);
    if (entry && entry.resetAt > now && entry.count >= 20) {
      return res.status(429).json({ error: 'Too many attempts. Please try again in 15 minutes.' });
    }
    if (!entry || entry.resetAt <= now) authAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    else entry.count += 1;
    return next();
  }

  function requireUser(req, res, next) {
    const user = findSessionUser(db, req);
    if (!user) return res.status(401).json({ error: 'Please sign in to continue.' });
    req.user = user;
    return next();
  }

  function requireRole(role) {
    return (req, res, next) => {
      if (req.user?.role !== role) return res.status(403).json({ error: 'You do not have permission to access this resource.' });
      return next();
    };
  }

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.get('/api/auth/me', (req, res) => res.json({ user: findSessionUser(db, req) }));

  app.post('/api/auth/register', limitAuthAttempts, async (req, res, next) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (!EMAIL_PATTERN.test(email) || email.length > 254) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (password.length < 8 || password.length > 128) return res.status(400).json({ error: 'Password must be between 8 and 128 characters.' });
    if (email === adminEmail) return res.status(409).json({ error: 'This email is reserved for the administrator account.' });
    try {
      const hash = await passwordHash(password);
      const result = db.prepare(`
        INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, 'learner', ?)
      `).run(email, hash, new Date().toISOString());
      const user = { id: Number(result.lastInsertRowid), email, role: 'learner' };
      createSession(db, res, user.id);
      return res.status(201).json({ user });
    } catch (error) {
      if (String(error.message).includes('UNIQUE constraint failed')) return res.status(409).json({ error: 'This email is already registered.' });
      return next(error);
    }
  });

  app.post('/api/auth/login', limitAuthAttempts, async (req, res, next) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const user = db.prepare('SELECT id, email, password_hash, role FROM users WHERE email = ? COLLATE NOCASE').get(email);
    try {
      if (!user || !(await verifyPassword(password, user.password_hash))) {
        return res.status(401).json({ error: 'Incorrect email or password.' });
      }
      createSession(db, res, user.id);
      return res.json({ user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
      return next(error);
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = getCookie(req, SESSION_COOKIE);
    if (token) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
    }
    res.clearCookie(SESSION_COOKIE, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', path: '/' });
    return res.json({ ok: true });
  });

  app.get('/api/results', requireUser, requireRole('learner'), (req, res) => {
    const rows = db.prepare(`
      SELECT id, title, completed_at, correct, wrong, unanswered, total, accuracy, band, duration_seconds
      FROM results WHERE user_id = ? ORDER BY completed_at DESC LIMIT 500
    `).all(req.user.id);
    return res.json({ results: rows.map(row => serializeResult({ ...row, learner_email: req.user.email })) });
  });

  app.post('/api/results', requireUser, requireRole('learner'), (req, res) => {
    const body = req.body || {};
    const title = String(body.title || '').trim();
    const correct = Number(body.correct);
    const wrong = Number(body.wrong);
    const unanswered = Number(body.unanswered);
    const total = Number(body.total);
    const band = Number(body.band);
    const durationSeconds = Number(body.durationSeconds);
    const details = Array.isArray(body.details)
      ? body.details.slice(0, 1000).map(item => ({
        questionNumber: Number(item.questionNumber),
        questionType: String(item.questionType || '').slice(0, 60),
        prompt: String(item.prompt || '').slice(0, 1000),
        userAnswer: String(item.userAnswer || '').slice(0, 1000),
        correctAnswer: String(item.correctAnswer || '').slice(0, 1000),
        status: ['correct', 'incorrect', 'unanswered'].includes(item.status) ? item.status : 'unanswered'
      })).filter(item => Number.isInteger(item.questionNumber) && item.questionNumber > 0)
      : [];
    const countsAreValid = [correct, wrong, unanswered, total].every(Number.isInteger)
      && total > 0 && total <= 1000
      && correct >= 0 && wrong >= 0 && unanswered >= 0
      && correct + wrong + unanswered === total;
    if (!title || title.length > 180 || !countsAreValid || !Number.isFinite(band) || band < 0 || band > 9 || !Number.isInteger(durationSeconds) || durationSeconds < 0 || durationSeconds > 24 * 60 * 60) {
      return res.status(400).json({ error: 'Invalid test result data.' });
    }
    const accuracy = Math.round(correct / total * 100);
    const resultId = crypto.randomUUID();
    const clientId = String(body.id || resultId).slice(0, 100);
    const completedAt = new Date().toISOString();
    db.prepare(`
      INSERT INTO results (id, user_id, client_id, title, completed_at, correct, wrong, unanswered, total, accuracy, band, duration_seconds, details_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, client_id) DO NOTHING
    `).run(resultId, req.user.id, clientId, title, completedAt, correct, wrong, unanswered, total, accuracy, band, durationSeconds, JSON.stringify(details));
    const row = db.prepare(`
      SELECT results.id, results.title, results.completed_at, results.correct, results.wrong, results.unanswered,
             results.total, results.accuracy, results.band, results.duration_seconds, users.email AS learner_email
      FROM results JOIN users ON users.id = results.user_id
      WHERE results.user_id = ? AND results.client_id = ?
    `).get(req.user.id, clientId);
    return res.status(201).json({ result: serializeResult(row) });
  });

  app.get('/api/admin/dashboard', requireUser, requireRole('admin'), (_req, res) => {
    const summary = db.prepare(`
      SELECT (SELECT COUNT(*) FROM users WHERE role = 'learner') AS learners,
             (SELECT COUNT(*) FROM results) AS attempts,
             (SELECT AVG(band) FROM results) AS average_band
    `).get();
    const rows = db.prepare(`
      SELECT results.id, results.title, results.completed_at, results.correct, results.wrong, results.unanswered,
             results.total, results.accuracy, results.band, results.duration_seconds, users.email AS learner_email
      FROM results JOIN users ON users.id = results.user_id
      ORDER BY results.completed_at DESC LIMIT 1000
    `).all();
    return res.json({
      summary: {
        learners: summary.learners,
        attempts: summary.attempts,
        averageBand: summary.average_band === null ? null : Number(summary.average_band)
      },
      results: rows.map(serializeResult)
    });
  });

  app.get('/api/admin/results/:id', requireUser, requireRole('admin'), (req, res) => {
    const row = db.prepare(`
      SELECT results.id, results.title, results.completed_at, results.correct, results.wrong, results.unanswered,
             results.total, results.accuracy, results.band, results.duration_seconds, results.details_json,
             users.email AS learner_email
      FROM results JOIN users ON users.id = results.user_id
      WHERE results.id = ?
    `).get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Test attempt not found.' });
    let details = [];
    try {
      details = JSON.parse(row.details_json || '[]');
    } catch {
      details = [];
    }
    return res.json({ result: { ...serializeResult(row), details } });
  });

  const publicFiles = new Set(['index.html', 'style.css', 'app.js', 'data.js', 'config.js', 'admin.html', 'admin.js']);
  app.get('/', (_req, res) => res.sendFile(path.join(ROOT, 'index.html')));
  app.get('/:file', (req, res, next) => {
    if (!publicFiles.has(req.params.file)) return next();
    return res.sendFile(path.join(ROOT, req.params.file));
  });
  app.get('/image/:file', (req, res, next) => {
    if (!['huflit_campus.jpg', 'huflit_logo.jpg'].includes(req.params.file)) return next();
    return res.sendFile(path.join(ROOT, 'image', req.params.file));
  });

  app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found.' }));
  app.use((error, _req, res, _next) => {
    console.error(error);
    return res.status(500).json({ error: 'The server encountered an error. Please try again.' });
  });

  return { app, db };
}

const isMainModule = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMainModule) {
  const { app } = createApplication();
  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '127.0.0.1';
  app.listen(port, host, () => console.log(`HUFLIT IELTS server running at http://${host}:${port}`));
}
import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';
import { sendPasswordResetEmail } from '../email.js';

const router = Router();
const resetRateMap = new Map();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Podaj login i hasło' });
  }
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Nieprawidłowy login lub hasło' });
  }
  res.json({ token: generateToken(user), username: user.username });
});

router.post('/change-password', authMiddleware, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Min. 6 znaków' });
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user || !bcrypt.compareSync(oldPassword, user.password_hash)) {
    return res.status(401).json({ error: 'Nieprawidłowe obecne hasło' });
  }
  const hash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, user.id);
  res.json({ ok: true });
});

router.get('/profile', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, username, email FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

router.put('/profile', authMiddleware, (req, res) => {
  const { email } = req.body;
  db.prepare('UPDATE users SET email = ? WHERE id = ?').run(email || null, req.user.id);
  res.json({ ok: true });
});

router.post('/forgot-password', (req, res) => {
  const ip = req.ip;
  const now = Date.now();
  const hits = resetRateMap.get(ip) || [];
  const recent = hits.filter(t => now - t < 3600000);
  if (recent.length >= 3) {
    return res.json({ ok: true });
  }
  recent.push(now);
  resetRateMap.set(ip, recent);

  const { username } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (user && user.email) {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expires = Date.now() + 3600000;
    db.prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?')
      .run(tokenHash, expires, user.id);

    const baseUrl = process.env.SITE_URL || `${req.protocol}://${req.get('host')}`;
    const resetLink = `${baseUrl}/admin/reset-password?token=${token}`;
    sendPasswordResetEmail(user.email, resetLink).catch(err =>
      console.error('Reset email error:', err.message)
    );
  }

  res.json({ ok: true });
});

router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = db.prepare(
    'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?'
  ).get(tokenHash, Date.now());

  if (!user) {
    return res.status(400).json({ error: 'Link wygasł lub jest nieprawidłowy' });
  }

  const hash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?')
    .run(hash, user.id);
  res.json({ ok: true });
});

export default router;

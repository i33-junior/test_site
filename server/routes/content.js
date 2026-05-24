import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/:section', (req, res) => {
  const row = db.prepare('SELECT data FROM content WHERE section = ?').get(req.params.section);
  if (!row) return res.status(404).json({ error: 'Sekcja nie znaleziona' });
  res.json(JSON.parse(row.data));
});

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT section, data FROM content').all();
  const result = {};
  for (const row of rows) {
    result[row.section] = JSON.parse(row.data);
  }
  res.json(result);
});

router.put('/:section', authMiddleware, (req, res) => {
  const data = JSON.stringify(req.body);
  db.prepare('INSERT OR REPLACE INTO content (section, data) VALUES (?, ?)').run(req.params.section, data);
  res.json({ ok: true });
});

export default router;

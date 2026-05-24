import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM testimonials ORDER BY sort_order').all());
});

router.post('/', authMiddleware, (req, res) => {
  const { sort_order, name, initials, service, text, rating, meta } = req.body;
  const r = db.prepare('INSERT INTO testimonials (sort_order, name, initials, service, text, rating, meta) VALUES (?,?,?,?,?,?,?)')
    .run(sort_order || 0, name, initials, service, text, rating || 5, meta);
  res.json({ id: r.lastInsertRowid });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { sort_order, name, initials, service, text, rating, meta } = req.body;
  db.prepare('UPDATE testimonials SET sort_order=?, name=?, initials=?, service=?, text=?, rating=?, meta=? WHERE id=?')
    .run(sort_order || 0, name, initials, service, text, rating || 5, meta, req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;

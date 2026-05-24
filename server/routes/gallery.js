import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM gallery ORDER BY sort_order').all());
});

router.post('/', authMiddleware, (req, res) => {
  const { sort_order, image, caption } = req.body;
  const r = db.prepare('INSERT INTO gallery (sort_order, image, caption) VALUES (?,?,?)').run(sort_order || 0, image || '', caption);
  res.json({ id: r.lastInsertRowid });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { sort_order, image, caption } = req.body;
  db.prepare('UPDATE gallery SET sort_order=?, image=?, caption=? WHERE id=?').run(sort_order || 0, image || '', caption, req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;

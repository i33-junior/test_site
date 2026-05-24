import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM services ORDER BY sort_order').all();
  res.json(rows.map(r => ({ ...r, features: r.features ? JSON.parse(r.features) : [] })));
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Nie znaleziono' });
  res.json({ ...row, features: row.features ? JSON.parse(row.features) : [] });
});

router.post('/', authMiddleware, (req, res) => {
  const { sort_order, number, eyebrow, name, name_accent, description, full_description, time, price, image, device_image, features } = req.body;
  const result = db.prepare(
    'INSERT INTO services (sort_order, number, eyebrow, name, name_accent, description, full_description, time, price, image, device_image, features) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
  ).run(sort_order || 0, number, eyebrow, name, name_accent, description, full_description, time, price, image || '', device_image || '', JSON.stringify(features || []));
  res.json({ id: result.lastInsertRowid });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { sort_order, number, eyebrow, name, name_accent, description, full_description, time, price, image, device_image, features } = req.body;
  db.prepare(
    'UPDATE services SET sort_order=?, number=?, eyebrow=?, name=?, name_accent=?, description=?, full_description=?, time=?, price=?, image=?, device_image=?, features=? WHERE id=?'
  ).run(sort_order || 0, number, eyebrow, name, name_accent, description, full_description, time, price, image || '', device_image || '', JSON.stringify(features || []), req.params.id);
  res.json({ ok: true });
});

router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;

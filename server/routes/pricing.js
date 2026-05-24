import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Groups
router.get('/groups', (req, res) => {
  const groups = db.prepare('SELECT * FROM pricing_groups ORDER BY sort_order').all();
  res.json(groups);
});

router.post('/groups', authMiddleware, (req, res) => {
  const { sort_order, icon, title, title_accent, subtitle, is_first_visit } = req.body;
  const r = db.prepare('INSERT INTO pricing_groups (sort_order, icon, title, title_accent, subtitle, is_first_visit) VALUES (?,?,?,?,?,?)')
    .run(sort_order || 0, icon, title, title_accent, subtitle, is_first_visit ? 1 : 0);
  res.json({ id: r.lastInsertRowid });
});

router.put('/groups/:id', authMiddleware, (req, res) => {
  const { sort_order, icon, title, title_accent, subtitle, is_first_visit } = req.body;
  db.prepare('UPDATE pricing_groups SET sort_order=?, icon=?, title=?, title_accent=?, subtitle=?, is_first_visit=? WHERE id=?')
    .run(sort_order || 0, icon, title, title_accent, subtitle, is_first_visit ? 1 : 0, req.params.id);
  res.json({ ok: true });
});

router.delete('/groups/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM pricing_groups WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Items
router.get('/items', (req, res) => {
  const groupId = req.query.group_id;
  const rows = groupId
    ? db.prepare('SELECT * FROM pricing_items WHERE group_id = ? ORDER BY sort_order').all(groupId)
    : db.prepare('SELECT * FROM pricing_items ORDER BY group_id, sort_order').all();
  res.json(rows);
});

router.post('/items', authMiddleware, (req, res) => {
  const { group_id, sort_order, name, name_small, time, price, old_price, badge, is_highlighted } = req.body;
  const r = db.prepare('INSERT INTO pricing_items (group_id, sort_order, name, name_small, time, price, old_price, badge, is_highlighted) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(group_id, sort_order || 0, name, name_small, time, price, old_price, badge, is_highlighted ? 1 : 0);
  res.json({ id: r.lastInsertRowid });
});

router.put('/items/:id', authMiddleware, (req, res) => {
  const { group_id, sort_order, name, name_small, time, price, old_price, badge, is_highlighted } = req.body;
  db.prepare('UPDATE pricing_items SET group_id=?, sort_order=?, name=?, name_small=?, time=?, price=?, old_price=?, badge=?, is_highlighted=? WHERE id=?')
    .run(group_id, sort_order || 0, name, name_small, time, price, old_price, badge, is_highlighted ? 1 : 0, req.params.id);
  res.json({ ok: true });
});

router.delete('/items/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM pricing_items WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// Full pricing data (groups + items together)
router.get('/full', (req, res) => {
  const groups = db.prepare('SELECT * FROM pricing_groups ORDER BY sort_order').all();
  const items = db.prepare('SELECT * FROM pricing_items ORDER BY sort_order').all();
  const result = groups.map(g => ({
    ...g,
    items: items.filter(i => i.group_id === g.id)
  }));
  res.json(result);
});

export default router;

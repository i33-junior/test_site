import { Router } from 'express';
import { sendContactEmail } from '../email.js';

const router = Router();
const rateMap = new Map();

router.post('/', async (req, res) => {
  const ip = req.ip;
  const now = Date.now();
  const window = 15 * 60 * 1000;
  const hits = rateMap.get(ip) || [];
  const recent = hits.filter(t => now - t < window);
  if (recent.length >= 3) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  recent.push(now);
  rateMap.set(ip, recent);

  const { name, phone, service, message } = req.body;
  if (!name || !phone || !service) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await sendContactEmail({ name, phone, service, message: message || '' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Contact email error:', err.message);
    res.status(500).json({ error: 'Failed to send' });
  }
});

export default router;

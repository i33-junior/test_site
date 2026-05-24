import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { initDB } from './db.js';

import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import servicesRoutes from './routes/services.js';
import pricingRoutes from './routes/pricing.js';
import galleryRoutes from './routes/gallery.js';
import testimonialsRoutes from './routes/testimonials.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

initDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Static files
const publicDir = join(__dirname, '..', 'public');
app.use('/uploads', express.static(join(publicDir, 'uploads')));
app.use('/img', express.static(join(publicDir, 'img')));
app.use('/robots.txt', express.static(join(publicDir, 'robots.txt')));
app.use('/sitemap.xml', express.static(join(publicDir, 'sitemap.xml')));

// Serve built frontend in production
const distDir = join(__dirname, '..', 'dist');
if (existsSync(distDir)) {
  app.use(express.static(distDir));
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/upload', uploadRoutes);

// SPA fallback (production)
if (existsSync(distDir)) {
  app.get('{*path}', (req, res) => {
    res.sendFile(join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Lady Glow server running on http://localhost:${PORT}`);
});

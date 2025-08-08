/**
 * Arkyn backend - simple Express API for contact leads
 * - POST /api/contact  -> accepts { name, email, phone, message, source }
 * - Saves leads to leads.json
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactRoute = (await import('./routes/contact.js')).default;

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// simple health route
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'arkyn-backend' });
});

// API routes
app.use('/api/contact', contactRoute);

// static served leads (optional — for admin / download)
// WARNING: In production, protect this endpoint or remove it.
app.get('/api/leads', async (req, res) => {
  try {
    const file = path.join(__dirname, 'leads.json');
    const raw = await readFile(file, 'utf8');
    return res.json(JSON.parse(raw || '[]'));
  } catch (err) {
    return res.status(500).json({ error: 'Could not read leads' });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Arkyn backend listening on port ${PORT}`);
});

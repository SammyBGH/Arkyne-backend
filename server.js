/**
 * Arkyn backend - simple Express API for contact leads
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactRoute = (await import('./routes/contact.js')).default;

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI not set in environment variables');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI) // no deprecated options needed in modern versions
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'arkyn-backend' });
});

// Routes
app.use('/api/contact', contactRoute);

// Admin: Fetch leads
app.get('/api/leads', async (req, res) => {
  try {
    const Lead = (await import('./models/Lead.js')).default;
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch leads' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Arkyn backend listening on port ${PORT}`);
});

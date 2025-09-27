import express from 'express';
import dotenv from 'dotenv';
import Subscriber from '../models/Subscriber.js';

dotenv.config();

const router = express.Router();

function isValidEmail(email) {
  return typeof email === 'string' && /.+@.+\..+/.test(email.trim());
}

// POST /api/newsletter
router.post('/', async (req, res) => {
  try {
    const { email, source } = req.body || {};
    if (!isValidEmail(email)) {
      return res.status(400).json({ ok: false, error: 'Valid email is required.' });
    }

    const normalized = email.trim().toLowerCase();

    // Upsert to avoid duplicates
    const sub = await Subscriber.findOneAndUpdate(
      { email: normalized },
      { $setOnInsert: { email: normalized, source: source || 'newsletter' } },
      { upsert: true, new: true }
    );

    return res.json({ ok: true, subscriber: { id: sub._id, email: sub.email } });
  } catch (err) {
    console.error('❌ Newsletter subscribe error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

export default router;

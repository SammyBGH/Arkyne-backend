/**
 * POST /api/contact
 * Body: { name, email, phone, message, source? }
 *
 * Saves to MongoDB
 */

import express from 'express';
import dotenv from 'dotenv';
import Lead from '../models/Lead.js';

dotenv.config();

const router = express.Router();

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, source } = req.body || {};

    // Basic validation
    if (!isNonEmptyString(name) || !isNonEmptyString(message)) {
      return res
        .status(400)
        .json({ ok: false, error: 'Name and message are required.' });
    }

    // Save to MongoDB
    const lead = await Lead.create({
      name: name.trim(),
      email: isNonEmptyString(email) ? email.trim() : null,
      phone: isNonEmptyString(phone) ? phone.trim() : null,
      message: message.trim(),
      source: source || 'web',
    });

    console.log('✅ Lead saved to MongoDB:', lead);

    return res.json({ ok: true, lead });
  } catch (err) {
    console.error('❌ Contact save error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

export default router;

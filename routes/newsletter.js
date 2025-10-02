import express from 'express';
import dotenv from 'dotenv';
import Subscriber from '../models/Subscriber.js';
import { sendMail } from '../utils/mailer.js';

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

    // Attempt to send confirmation email. Do not block success if email fails.
    try {
      const subject = 'You\'re subscribed to Arkyne';
      const text = `Thanks for subscribing to Arkyne updates! We'll occasionally email you about new work, insights, and product tips. If this wasn't you, you can ignore this email.`;
      const html = `
        <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#2A2A2A;">
          <div style="max-width:560px;margin:auto;padding:24px;border-radius:12px;border:1px solid #E9C46A33;background:#F5F3F0;">
            <h2 style="margin:0 0 8px;color:#3C2A4D;">Welcome to Arkyne ✨</h2>
            <p style="margin:0 0 16px;">Thanks for subscribing! You\'ll occasionally receive updates about new projects, design & engineering insights, and helpful product tips.</p>
            <p style="margin:0 0 16px;">If this wasn\'t you, you can safely ignore this message.</p>
            <hr style="border:none;border-top:1px solid #E9C46A55;margin:16px 0;" />
            <p style="font-size:12px;color:#6b5a6a;">Arkyne — Refuge of Light</p>
          </div>
        </div>`;

      await sendMail({ to: normalized, subject, text, html });
    } catch (mailErr) {
      console.error('⚠️ Failed to send subscription email:', mailErr?.message || mailErr);
    }

    return res.json({ ok: true, subscriber: { id: sub._id, email: sub.email } });
  } catch (err) {
    console.error('❌ Newsletter subscribe error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

export default router;

/**
 * POST /api/contact
 * Body: { name, email, phone, message, source? }
 *
 * Saves to leads.json
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LEADS_PATH = path.join(__dirname, '..', 'leads.json');

// simple validation helper
function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, source } = req.body || {};

    // basic validation
    if (!isNonEmptyString(name) || !isNonEmptyString(message)) {
      return res.status(400).json({ ok: false, error: 'Name and message are required.' });
    }

    // Create lead object
    const lead = {
      id: Date.now(),
      name: name.trim(),
      email: isNonEmptyString(email) ? email.trim() : null,
      phone: isNonEmptyString(phone) ? phone.trim() : null,
      message: message.trim(),
      source: source || 'web',
      createdAt: new Date().toISOString()
    };

    // ensure leads file exists
    await fs.ensureFile(LEADS_PATH);
    const leadsRaw = await fs.readFile(LEADS_PATH, 'utf8').catch(() => '[]');
    let leads = [];
    try { leads = JSON.parse(leadsRaw || '[]'); } catch { leads = []; }

    // Append and save
    leads.unshift(lead); // newest first
    await fs.writeFile(LEADS_PATH, JSON.stringify(leads, null, 2), 'utf8');

    // Success response
    return res.json({ ok: true, lead });
  } catch (err) {
    console.error('Contact save error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

export default router;

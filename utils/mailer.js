import fetch from 'node-fetch';

// Brevo (Sendinblue) transactional email via HTTP API
// Required envs:
// - BREVO_API_KEY
// - FROM_EMAIL (e.g. "Arkyne <no-reply@yourdomain.com>" or just an email)

function parseFrom(from) {
  // Accept formats like: "Name <email@domain>" or just "email@domain"
  if (!from) return { email: undefined, name: undefined };
  const match = /^(.*)<\s*([^>]+)\s*>\s*$/.exec(from);
  if (match) {
    const name = match[1].trim().replace(/^"|"$/g, '') || undefined;
    const email = match[2].trim();
    return { email, name };
  }
  return { email: from.trim(), name: undefined };
}

export async function sendMail({ to, subject, text, html }) {
  const { BREVO_API_KEY, FROM_EMAIL } = process.env;
  if (!BREVO_API_KEY) throw new Error('BREVO_API_KEY is not set');
  if (!FROM_EMAIL) throw new Error('FROM_EMAIL is not set');
  if (!to) throw new Error('Recipient email (to) is required');

  const { email: fromEmail, name: fromName } = parseFrom(FROM_EMAIL);
  if (!fromEmail) throw new Error('FROM_EMAIL must contain a valid email');

  const payload = {
    sender: fromName ? { email: fromEmail, name: fromName } : { email: fromEmail },
    to: [{ email: to }],
    subject: subject || 'Message from Arkyne',
    htmlContent: html || undefined,
    textContent: text || undefined,
  };

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Brevo send failed: ${res.status} ${res.statusText} ${errText}`);
  }

  const data = await res.json().catch(() => ({}));
  return data; // typically contains messageId(s)
}

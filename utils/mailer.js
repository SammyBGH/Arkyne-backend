import nodemailer from 'nodemailer';

// Create a singleton transporter using environment variables
// Required envs:
// - SMTP_HOST
// - SMTP_PORT (number)
// - SMTP_USER
// - SMTP_PASS
// - FROM_EMAIL (e.g. "Arkyne <no-reply@yourdomain>")

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const port = Number(SMTP_PORT || 587);

  if (!SMTP_HOST || !port || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP configuration missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS');
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const { FROM_EMAIL } = process.env;
  if (!FROM_EMAIL) throw new Error('FROM_EMAIL is not set');

  const tx = getTransporter();
  const info = await tx.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    text,
    html,
  });
  return info;
}

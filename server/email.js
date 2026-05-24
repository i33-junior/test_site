import nodemailer from 'nodemailer';

const transporter = process.env.SMTP_USER ? nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}) : null;

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || '172891elena@gmail.com';
const SITE_NAME = 'Lady Glow';

export async function sendContactEmail({ name, phone, service, message }) {
  if (!transporter) {
    console.warn('SMTP not configured — skipping contact email');
    return false;
  }
  await transporter.sendMail({
    from: `"${SITE_NAME}" <${process.env.SMTP_USER}>`,
    to: CONTACT_EMAIL,
    subject: `Nowa rezerwacja: ${service} — ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;background:#0a0807;color:#f5ead2;border:1px solid #d4a64a;">
        <h2 style="color:#f6d57a;margin:0 0 20px;">${SITE_NAME} — Nowa wiadomość</h2>
        <p><strong style="color:#d4a64a;">Imię:</strong> ${name}</p>
        <p><strong style="color:#d4a64a;">Telefon:</strong> <a href="tel:${phone}" style="color:#27d3c5;">${phone}</a></p>
        <p><strong style="color:#d4a64a;">Zabieg:</strong> ${service}</p>
        ${message ? `<p><strong style="color:#d4a64a;">Wiadomość:</strong> ${message}</p>` : ''}
        <hr style="border-color:#d4a64a;opacity:.3;margin:20px 0;">
        <p style="font-size:12px;color:#8a7a5e;">Wysłano z formularza kontaktowego ${SITE_NAME}</p>
      </div>
    `
  });
  return true;
}

export async function sendPasswordResetEmail(toEmail, resetLink) {
  if (!transporter) {
    console.warn('SMTP not configured — skipping reset email');
    return false;
  }
  await transporter.sendMail({
    from: `"${SITE_NAME}" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `${SITE_NAME} — Reset hasła`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;background:#0a0807;color:#f5ead2;border:1px solid #d4a64a;">
        <h2 style="color:#f6d57a;margin:0 0 20px;">${SITE_NAME} — Reset hasła</h2>
        <p>Otrzymaliśmy prośbę o zmianę hasła. Kliknij poniższy link:</p>
        <a href="${resetLink}" style="display:inline-block;margin:20px 0;padding:14px 28px;background:linear-gradient(135deg,#f6d57a,#d4a64a);color:#0a0807;text-decoration:none;font-weight:bold;letter-spacing:1px;">ZMIEŃ HASŁO</a>
        <p style="font-size:13px;color:#8a7a5e;">Link ważny przez 1 godzinę. Jeśli nie prosiłeś o zmianę hasła — zignoruj tę wiadomość.</p>
      </div>
    `
  });
  return true;
}

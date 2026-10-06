import { createHash, randomInt, timingSafeEqual } from 'node:crypto';
import nodemailer from 'nodemailer';

const CODE_LIFETIME_MS = 10 * 60 * 1000;

function hashVerificationCode(email, code) {
  return createHash('sha256').update(`${email}:${code}`).digest();
}

export async function sendEmailVerificationCode(email) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    throw new Error('SMTP_HOST, SMTP_USER, SMTP_PASS, and EMAIL_FROM must be configured to send verification codes.');
  }

  const code = String(randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + CODE_LIFETIME_MS);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: 'Your StudentOS email verification code',
    text: `Your StudentOS verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your StudentOS verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes. If you did not request this, you can ignore this email.</p>`
  });

  return {
    codeHash: hashVerificationCode(email, code).toString('hex'),
    expiresAt
  };
}

export function isValidVerificationCode(email, code, storedHash) {
  if (!/^\d{6}$/.test(code || '') || !/^[\da-f]{64}$/i.test(storedHash || '')) return false;
  const expectedHash = Buffer.from(storedHash, 'hex');
  const suppliedHash = hashVerificationCode(email, code);
  return timingSafeEqual(expectedHash, suppliedHash);
}

import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const TOKEN_LIFETIME_SECONDS = 60 * 60 * 12;
const developmentSecret = process.env.NODE_ENV === 'production' ? null : randomBytes(32).toString('hex');

function getTokenSecret() {
  const secret = process.env.JWT_SECRET || developmentSecret;
  if (!secret) {
    throw new Error('JWT_SECRET must be configured before issuing or validating authentication tokens.');
  }
  return secret;
}

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, 64);
  return `scrypt:${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password, storedPassword) {
  if (!storedPassword?.startsWith('scrypt:')) {
    return { valid: storedPassword === password, needsUpgrade: storedPassword === password };
  }

  const [, saltHex, hashHex] = storedPassword.split(':');
  if (!saltHex || !hashHex || saltHex.length !== 32 || hashHex.length !== 128) {
    return { valid: false, needsUpgrade: false };
  }

  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length);
  return {
    valid: timingSafeEqual(expected, actual),
    needsUpgrade: false
  };
}

export function createAuthToken(userId) {
  const payload = Buffer.from(JSON.stringify({
    sub: userId.toString(),
    exp: Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS
  })).toString('base64url');
  const signature = createHmac('sha256', getTokenSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyAuthToken(token) {
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return null;

  const expectedSignature = createHmac('sha256', getTokenSecret()).update(payload).digest();
  let suppliedSignature;
  try {
    suppliedSignature = Buffer.from(signature, 'base64url');
  } catch {
    return null;
  }
  if (suppliedSignature.length !== expectedSignature.length || !timingSafeEqual(expectedSignature, suppliedSignature)) {
    return null;
  }

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof claims.sub !== 'string' || !claims.sub || !Number.isFinite(claims.exp) || claims.exp <= Date.now() / 1000) {
      return null;
    }
    return claims;
  } catch {
    return null;
  }
}

export function getConfiguredSuperAdminEmails() {
  return (process.env.SUPER_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

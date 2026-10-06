import { scrypt as scryptCallback, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../server/models/User.js';

dotenv.config();

const scrypt = promisify(scryptCallback);

function readSecret(prompt) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
    return Promise.reject(new Error('Run this setup command in an interactive terminal so passwords are not echoed.'));
  }

  return new Promise((resolve, reject) => {
    const input = process.stdin;
    let value = '';
    let settled = false;
    input.setRawMode(true);
    input.resume();
    process.stdout.write(prompt);

    const finish = (error) => {
      if (settled) return;
      settled = true;
      input.off('data', handleInput);
      input.setRawMode(false);
      input.pause();
      process.stdout.write('\n');
      if (error) reject(error);
      else resolve(value);
    };

    const handleInput = (chunk) => {
      for (const character of chunk.toString('utf8')) {
        if (character === '\u0003') {
          finish(new Error('Super-admin setup cancelled.'));
          return;
        }
        if (character === '\r' || character === '\n') {
          finish();
          return;
        }
        if (character === '\u007f' || character === '\b') {
          value = value.slice(0, -1);
        } else if (character >= ' ' && character <= '~') {
          value += character;
        }
      }
    };

    input.on('data', handleInput);
  });
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, 64);
  return `scrypt:${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}

async function main() {
  const superAdminEmails = (process.env.SUPER_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured in .env.');
  if (superAdminEmails.length !== 1) {
    throw new Error('Set SUPER_ADMIN_EMAILS to the single email address for the first super-admin account before running this command.');
  }
  const email = superAdminEmails[0];

  console.log('This one-time setup creates the allowlisted super-admin account for local testing.');
  console.log('Use at least 12 characters. Password input is hidden and will only be stored as a hash.');
  const password = await readSecret('Choose super-admin password: ');
  const confirmation = await readSecret('Confirm super-admin password: ');
  if (password !== confirmation) throw new Error('The passwords do not match.');
  if (password.length < 12 || password.length > 128) {
    throw new Error('Choose a password between 12 and 128 characters.');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  try {
    if (await User.exists({ accessLevel: 'super_admin' })) {
      throw new Error('A super-admin account already exists. Bootstrap is disabled to protect existing access.');
    }

    const passwordHash = await hashPassword(password);
    let user = await User.findOne({ email });
    if (!user) {
      const now = new Date().toISOString();
      const profile = {
        id: `usr_${Date.now()}_${randomBytes(3).toString('hex')}`,
        name: 'Super Admin',
        email,
        createdAt: now,
        role: 'Full Stack Engineering Student',
        bio: '',
        targetRole: 'Platform Administration',
        onboarded: true
      };
      user = new User({
        email: profile.email,
        name: profile.name,
        targetRole: profile.targetRole,
        profile,
        completedPhaseNumbers: [],
        completedLessonIds: []
      });
    }

    user.password = passwordHash;
    user.emailVerified = true;
    user.emailVerificationCodeHash = undefined;
    user.emailVerificationExpiresAt = undefined;
    user.emailVerificationLastSentAt = undefined;
    user.emailVerificationAttempts = 0;
    user.accessLevel = 'super_admin';
    user.adminRequestStatus = 'approved';
    user.adminReviewedAt = new Date();
    user.adminReviewedBy = null;
    await user.save();
  } finally {
    await mongoose.disconnect();
  }

  console.log(`Super-admin account created successfully. Sign in at /login with ${email} and the password you entered.`);
}

main().catch(async (error) => {
  console.error(`Super-admin setup failed: ${error.message}`);
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  process.exitCode = 1;
});

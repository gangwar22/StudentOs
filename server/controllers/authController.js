import { User } from '../models/User.js';
import { createAuthToken, getConfiguredSuperAdminEmails, hashPassword, verifyPassword } from '../utils/auth.js';
import { isValidVerificationCode, sendEmailVerificationCode } from '../services/emailVerificationService.js';

function toSafeUser(user) {
  const isSuperAdmin = getConfiguredSuperAdminEmails().includes(user.email?.toLowerCase());
  const effectiveAccessLevel = (isSuperAdmin || user.accessLevel === 'super_admin')
    ? 'super_admin'
    : (user.accessLevel || 'student');

  return {
    ...(user.profile?.toObject?.() || user.profile || {}),
    id: user._id.toString(),
    name: user.name || user.profile?.name || '',
    email: user.email,
    emailVerified: isSuperAdmin ? true : Boolean(user.emailVerified),
    accessLevel: effectiveAccessLevel,
    adminRequestStatus: user.adminRequestStatus,
    adminRequestReason: user.adminRequestReason || '',
    adminRequestedAt: user.adminRequestedAt,
    adminReviewedAt: user.adminReviewedAt
  };
}

function authResponse(user) {
  return { success: true, token: createAuthToken(user._id), user: toSafeUser(user) };
}

function isValidEmail(email) {
  return typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, targetRole } = req.body;
    if (!isValidEmail(email) || typeof password !== 'string' || password.length < 8 || password.length > 128 || typeof name !== 'string' || !name.trim() || name.trim().length > 100) {
      return res.status(400).json({ success: false, error: 'Enter a valid email, a name under 100 characters, and a password between 8 and 128 characters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    const nowIso = new Date().toISOString();
    const initialStartDates = { 1: nowIso };
    const initialProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name || normalizedEmail.split('@')[0].toUpperCase(),
      email: normalizedEmail,
      createdAt: nowIso,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      role: 'Full Stack Engineering Student',
      bio: 'Aspiring Full-Stack Software Engineer.',
      targetRole: targetRole || 'Full Stack Developer',
      streakDays: 1,
      weeklyGoalHours: 20,
      completedHours: 0,
      skillsMastered: 0,
      projectsCompleted: 0,
      xpPoints: 0,
      level: 'Beginner Scholar',
      onboarded: false
    };

    const isSuperAdminEmail = getConfiguredSuperAdminEmails().includes(normalizedEmail);

    const user = new User({
      email: normalizedEmail,
      password: await hashPassword(password),
      accessLevel: isSuperAdminEmail ? 'super_admin' : 'student',
      emailVerified: isSuperAdminEmail,
      name: initialProfile.name,
      targetRole: initialProfile.targetRole,
      profile: initialProfile,
      completedPhaseNumbers: [],
      completedLessonIds: [],
      phaseStartDates: initialStartDates,
      phaseDaysSpent: { 1: 1 },
      assessmentAttempts: [],
      dailyGoals: [],
      weeklyGoals: [],
      monthlyGoals: [],
      submittedMiniProjects: {},
      reflectionLogs: [],
      aiMentorHistory: [],
      generatedQuizzes: []
    });

    await user.save();
    res.status(201).json(authResponse(user));
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }
    res.status(500).json({ success: false, error: 'Unable to create your account right now.' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isValidEmail(email) || typeof password !== 'string' || !password) {
      return res.status(400).json({ success: false, error: 'Enter a valid email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Email or password is incorrect.' });
    }

    const { valid, needsUpgrade } = await verifyPassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Email or password is incorrect.' });
    }

    if (getConfiguredSuperAdminEmails().includes(normalizedEmail)) {
      user.accessLevel = 'super_admin';
      user.emailVerified = true;
    }

    if (needsUpgrade) user.password = await hashPassword(password);
    if (user.isModified()) await user.save();
    res.json(authResponse(user));
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Unable to sign in right now.' });
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    if (getConfiguredSuperAdminEmails().includes(req.user.email?.toLowerCase()) && req.user.accessLevel !== 'super_admin') {
      req.user.accessLevel = 'super_admin';
      req.user.emailVerified = true;
      await req.user.save();
    }
    res.json({ success: true, user: toSafeUser(req.user) });
  } catch (error) {
    next(error);
  }
};

export const sendVerificationCode = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+emailVerificationLastSentAt');
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    if (user.emailVerified) return res.status(409).json({ success: false, error: 'Your email is already verified.' });

    const now = Date.now();
    if (user.emailVerificationLastSentAt && now - user.emailVerificationLastSentAt.getTime() < 60_000) {
      return res.status(429).json({ success: false, error: 'Please wait one minute before requesting another code.' });
    }

    let verification;
    try {
      verification = await sendEmailVerificationCode(user.email);
    } catch (error) {
      console.error('Email verification delivery error:', error.message);
      return res.status(503).json({ success: false, error: 'Email verification is not available. Please contact the site administrator.' });
    }

    user.emailVerificationCodeHash = verification.codeHash;
    user.emailVerificationExpiresAt = verification.expiresAt;
    user.emailVerificationLastSentAt = new Date(now);
    user.emailVerificationAttempts = 0;
    await user.save();
    res.json({ success: true, expiresAt: verification.expiresAt });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const code = typeof req.body.code === 'string' ? req.body.code.trim() : '';
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ success: false, error: 'Enter the 6-digit code from your email.' });
    }

    const user = await User.findById(req.user._id)
      .select('+emailVerificationCodeHash +emailVerificationExpiresAt +emailVerificationAttempts');
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    if (user.emailVerified) return res.json({ success: true, user: toSafeUser(user) });
    if (!user.emailVerificationCodeHash || !user.emailVerificationExpiresAt) {
      return res.status(400).json({ success: false, error: 'Request a new verification code first.' });
    }
    if (user.emailVerificationExpiresAt.getTime() <= Date.now()) {
      user.emailVerificationCodeHash = undefined;
      user.emailVerificationExpiresAt = undefined;
      await user.save();
      return res.status(400).json({ success: false, error: 'That code has expired. Request a new one.' });
    }
    if (user.emailVerificationAttempts >= 5) {
      return res.status(429).json({ success: false, error: 'Too many incorrect codes. Request a new code after one minute.' });
    }
    if (!isValidVerificationCode(user.email, code, user.emailVerificationCodeHash)) {
      user.emailVerificationAttempts += 1;
      await user.save();
      return res.status(400).json({ success: false, error: 'That verification code is incorrect.' });
    }

    user.emailVerified = true;
    user.emailVerificationCodeHash = undefined;
    user.emailVerificationExpiresAt = undefined;
    user.emailVerificationLastSentAt = undefined;
    user.emailVerificationAttempts = 0;
    if (getConfiguredSuperAdminEmails().includes(user.email)) user.accessLevel = 'super_admin';
    await user.save();
    res.json({ success: true, user: toSafeUser(user) });
  } catch (error) {
    next(error);
  }
};

import { User } from '../models/User.js';
import { getConfiguredSuperAdminEmails, verifyAuthToken } from '../utils/auth.js';

export async function authenticate(req, res, next) {
  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, error: 'Please sign in to continue.' });
  }

  let claims;
  try {
    claims = verifyAuthToken(token);
  } catch (error) {
    console.error('Authentication token configuration error:', error);
    return res.status(503).json({ success: false, error: 'Authentication is temporarily unavailable.' });
  }
  if (!claims) {
    return res.status(401).json({ success: false, error: 'Your session has expired. Please sign in again.' });
  }

  try {
    const user = await User.findById(claims.sub);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Your account could not be found. Please sign in again.' });
    }

    if (getConfiguredSuperAdminEmails().includes(user.email?.toLowerCase()) && user.accessLevel !== 'super_admin') {
      user.accessLevel = 'super_admin';
      user.emailVerified = true;
      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAccessLevel(...allowedLevels) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Please sign in to continue.' });
    }
    const isSuperAdminEmail = getConfiguredSuperAdminEmails().includes(req.user.email?.toLowerCase());
    const effectiveLevel = (isSuperAdminEmail || req.user.accessLevel === 'super_admin')
      ? 'super_admin'
      : req.user.accessLevel;

    if (!allowedLevels.includes(effectiveLevel)) {
      return res.status(403).json({ success: false, error: 'You do not have permission to perform this action.' });
    }
    next();
  };
}

export async function authenticateOptional(req, res, next) {
  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    req.user = null;
    return next();
  }

  try {
    const claims = verifyAuthToken(token);
    if (!claims) {
      req.user = null;
      return next();
    }

    const user = await User.findById(claims.sub);
    req.user = user || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
}


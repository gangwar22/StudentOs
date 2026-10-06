import { User } from '../models/User.js';

const userSummaryFields = '_id name email accessLevel adminRequestStatus createdAt';

export const getAdminOverview = async (req, res, next) => {
  try {
    const [userCount, adminCount, superAdminCount, pendingRequestCount, rawUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ accessLevel: 'admin' }),
      User.countDocuments({ accessLevel: 'super_admin' }),
      User.countDocuments({ adminRequestStatus: 'pending' }),
      User.find()
        .select('_id name email accessLevel adminRequestStatus createdAt updatedAt totalXP profile completedPhaseNumbers completedLessonIds assessmentAttempts reflectionLogs dailyGoals weeklyGoals monthlyGoals')
        .sort({ createdAt: -1 })
        .limit(200)
        .lean()
    ]);

    const users = rawUsers.map((u) => ({
      _id: u._id,
      name: u.name || u.profile?.name || '',
      email: u.email,
      accessLevel: u.accessLevel || 'student',
      adminRequestStatus: u.adminRequestStatus || 'none',
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      targetRole: u.profile?.targetRole || u.targetRole || 'Full Stack Developer',
      totalXP: u.totalXP || u.profile?.xpPoints || 0,
      level: u.profile?.level || 'Beginner Scholar',
      streakDays: u.profile?.streakDays || 0,
      completedPhasesCount: (u.completedPhaseNumbers || []).length,
      completedLessonsCount: (u.completedLessonIds || []).length,
      assessmentAttemptsCount: (u.assessmentAttempts || []).length,
      reflectionLogsCount: (u.reflectionLogs || []).length,
      goalsCount:
        (u.dailyGoals || []).length +
        (u.weeklyGoals || []).length +
        (u.monthlyGoals || []).length
    }));

    res.json({
      success: true,
      overview: {
        userCount,
        studentCount: Math.max(0, userCount - adminCount - superAdminCount),
        adminCount,
        superAdminCount,
        pendingRequestCount
      },
      users
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -emailVerificationCodeHash -emailVerificationExpiresAt -emailVerificationLastSentAt -emailVerificationAttempts')
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const submitAdminRequest = async (req, res, next) => {
  try {
    const reason = typeof req.body.reason === 'string' ? req.body.reason.trim() : '';
    if (reason.length < 5 || reason.length > 1000) {
      return res.status(400).json({ success: false, error: 'Please provide a request reason between 5 and 1000 characters.' });
    }
    if (req.user.accessLevel !== 'student') {
      return res.status(409).json({ success: false, error: 'This account does not need to request admin access.' });
    }
    if (req.user.adminRequestStatus === 'pending') {
      return res.status(409).json({ success: false, error: 'Your admin access request is already pending.' });
    }
    if (req.user.adminRequestStatus === 'approved') {
      return res.status(409).json({ success: false, error: 'Your admin access request has already been approved.' });
    }

    req.user.adminRequestStatus = 'pending';
    req.user.adminRequestReason = reason;
    req.user.adminRequestedAt = new Date();
    req.user.adminReviewedAt = null;
    req.user.adminReviewedBy = null;
    await req.user.save();
    res.status(201).json({
      success: true,
      request: {
        status: req.user.adminRequestStatus,
        reason: req.user.adminRequestReason,
        requestedAt: req.user.adminRequestedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminRequests = async (req, res, next) => {
  try {
    const requests = await User.find({ adminRequestStatus: { $in: ['pending', 'approved', 'rejected'] } })
      .select(`${userSummaryFields} adminRequestReason adminRequestedAt adminReviewedAt adminReviewedBy`)
      .populate('adminReviewedBy', 'name email')
      .sort({ adminRequestedAt: -1 })
      .limit(200)
      .lean();
    res.json({ success: true, requests });
  } catch (error) {
    next(error);
  }
};

export const reviewAdminRequest = async (req, res, next) => {
  try {
    const decision = req.body.decision;
    if (!['approve', 'reject'].includes(decision)) {
      return res.status(400).json({ success: false, error: 'Decision must be approve or reject.' });
    }

    const target = await User.findById(req.params.userId);
    if (!target) return res.status(404).json({ success: false, error: 'User not found.' });
    if (target._id.equals(req.user._id)) {
      return res.status(400).json({ success: false, error: 'You cannot review your own admin request.' });
    }
    if (target.adminRequestStatus !== 'pending') {
      return res.status(409).json({ success: false, error: 'This admin request is no longer pending.' });
    }

    target.adminRequestStatus = decision === 'approve' ? 'approved' : 'rejected';
    target.adminReviewedAt = new Date();
    target.adminReviewedBy = req.user._id;
    if (decision === 'approve') target.accessLevel = 'admin';
    await target.save();

    res.json({ success: true, user: target });
  } catch (error) {
    next(error);
  }
};

export const updateUserAccess = async (req, res, next) => {
  try {
    const action = req.body.action || 'revoke';
    if (!['grant', 'revoke'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Action must be "grant" or "revoke".' });
    }

    const target = await User.findById(req.params.userId);
    if (!target) return res.status(404).json({ success: false, error: 'User not found.' });

    if (target._id.equals(req.user._id)) {
      return res.status(400).json({ success: false, error: 'You cannot alter your own access level.' });
    }
    if (target.accessLevel === 'super_admin') {
      return res.status(400).json({ success: false, error: 'Super-admin access cannot be altered.' });
    }

    if (action === 'grant') {
      target.accessLevel = 'admin';
      target.adminRequestStatus = 'approved';
      target.adminReviewedAt = new Date();
      target.adminReviewedBy = req.user._id;
    } else {
      target.accessLevel = 'student';
      target.adminRequestStatus = 'none';
      target.adminReviewedAt = new Date();
      target.adminReviewedBy = req.user._id;
    }

    await target.save();
    res.json({
      success: true,
      user: target,
      message: action === 'grant' ? `Admin access granted to ${target.email}` : `Admin access revoked for ${target.email}`
    });
  } catch (error) {
    next(error);
  }
};

export const revokeAdminAccess = updateUserAccess;

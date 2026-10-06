import { User } from '../models/User.js';

const SYNC_FIELDS = [
  'completedPhaseNumbers',
  'completedLessonIds',
  'phaseStartDates',
  'phaseCompletionDates',
  'phaseDaysSpent',
  'submittedMiniProjects',
  'dailyGoals',
  'weeklyGoals',
  'monthlyGoals',
  'reflectionLogs',
  'assessmentAttempts',
  'aiMentorHistory',
  'solvedProblemIds',
  'totalXP',
  'activityLogs',
  'askedQuestionIds',
  'practiceDailyState'
];

const PROFILE_FIELDS = ['name', 'bio', 'targetRole', 'avatar', 'socialLinks', 'preferences'];

export const getUserData = (req, res) => {
  res.json({ success: true, data: req.user });
};

export const syncUserData = async (req, res, next) => {
  try {
    const updates = {};
    for (const field of SYNC_FIELDS) {
      if (Object.hasOwn(req.body, field)) updates[field] = req.body[field];
    }

    if (req.body.profile && typeof req.body.profile === 'object' && !Array.isArray(req.body.profile)) {
      const profileUpdates = {};
      for (const field of PROFILE_FIELDS) {
        if (Object.hasOwn(req.body.profile, field)) profileUpdates[field] = req.body.profile[field];
      }
      updates.profile = { ...(req.user.profile || {}), ...profileUpdates };
      if (typeof profileUpdates.name === 'string') updates.name = profileUpdates.name;
      if (typeof profileUpdates.targetRole === 'string') updates.targetRole = profileUpdates.targetRole;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, error: 'No editable user data was provided.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ success: false, error: 'User not found.' });
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

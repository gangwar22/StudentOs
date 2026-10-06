import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Brain,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Clock3,
  Code2,
  Copy,
  Crown,
  ExternalLink,
  Eye,
  Filter,
  Flame,
  GraduationCap,
  Info,
  Layers,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Mail,
  MessageSquare,
  Moon,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Target,
  TrendingUp,
  Trophy,
  User,
  UserCheck,
  UserMinus,
  UserPlus,
  UserRound,
  Users,
  X,
  XCircle,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiRequest } from '../services/api';

const PHASE_NAMES = {
  1: 'Phase 1: Student Profile & Course Portal (HTML)',
  2: 'Phase 2: Modern CSS & Responsive UI Layouts',
  3: 'Phase 3: JavaScript DOM, Events & App Logic',
  4: 'Phase 4: ES6+ & Google Gemini AI Integration',
  5: 'Phase 5: React.js Component Architecture & State',
  6: 'Phase 6: Node.js, Express & MongoDB REST APIs',
  7: 'Phase 7: Full-Stack Capstone (CollabSphere SaaS)'
};

function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' });
  } catch {
    return '—';
  }
}

function formatDateTime(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '—';
  }
}

/* =========================================================================
   STUDENT DETAIL MODAL: WORLD-CLASS STUDENT PORTFOLIO & DOSSIER INSPECTOR
========================================================================= */
function StudentDetailModal({ studentId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('curriculum');
  const [copiedId, setCopiedId] = useState(false);
  const [lessonSearch, setLessonSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function fetchDetails() {
      setLoading(true);
      setError('');
      try {
        const response = await apiRequest(`/api/admin/users/${encodeURIComponent(studentId)}/details`);
        if (!cancelled) {
          setData(response.user);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load student dossier.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDetails();
    return () => { cancelled = true; };
  }, [studentId]);

  if (!studentId) return null;

  const profile = data?.profile || {};
  const assessmentAttempts = data?.assessmentAttempts || [];
  const reflectionLogs = data?.reflectionLogs || [];
  const dailyGoals = data?.dailyGoals || [];
  const weeklyGoals = data?.weeklyGoals || [];
  const monthlyGoals = data?.monthlyGoals || [];
  const aiMentorHistory = data?.aiMentorHistory || [];
  const completedPhases = data?.completedPhaseNumbers || [];
  const completedLessons = data?.completedLessonIds || [];
  const activityLogs = data?.activityLogs || [];

  // Analytical calculations
  const totalQuizzes = assessmentAttempts.length;
  const passedQuizzes = assessmentAttempts.filter((a) => a.passed || a.score >= (a.passingScore || 80)).length;
  const averageScore = totalQuizzes
    ? Math.round(assessmentAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalQuizzes)
    : 0;

  const totalGoals = dailyGoals.length + weeklyGoals.length + monthlyGoals.length;
  const completedGoals =
    dailyGoals.filter((g) => g.completed).length +
    weeklyGoals.filter((g) => g.completed).length +
    monthlyGoals.filter((g) => g.completed).length;

  const curriculumPercentage = Math.round((completedPhases.length / 7) * 100);

  const handleCopyId = () => {
    if (data?._id) {
      navigator.clipboard.writeText(data._id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const filteredCompletedLessons = completedLessons.filter((id) =>
    id.toLowerCase().includes(lessonSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative flex flex-col w-full max-w-5xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Banner with Premium Executive Styling */}
        <div className="relative border-b border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white overflow-hidden">
          {/* Subtle Ambient Backing Glow */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 via-indigo-500 to-purple-500 text-white font-black text-2xl sm:text-3xl shadow-xl shadow-brand-500/30 border-2 border-white/20">
                  {data?.name ? data.name[0].toUpperCase() : 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-slate-900 bg-emerald-500 shadow-xs flex items-center justify-center" title="Verified Account">
                  <Check className="h-3 w-3 text-white stroke-[3]" />
                </div>
              </div>

              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-xl sm:text-2xl font-black text-white truncate tracking-tight">
                    {data?.name || profile?.name || 'Student Dossier'}
                  </h3>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${
                    data?.accessLevel === 'super_admin'
                      ? 'bg-purple-500/25 text-purple-200 border border-purple-400/40 shadow-xs'
                      : data?.accessLevel === 'admin'
                        ? 'bg-indigo-500/25 text-indigo-200 border border-indigo-400/40 shadow-xs'
                        : 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 shadow-xs'
                  }`}>
                    {data?.accessLevel === 'super_admin' ? (
                      <Crown className="h-3.5 w-3.5 text-purple-300" />
                    ) : data?.accessLevel === 'admin' ? (
                      <Shield className="h-3.5 w-3.5 text-indigo-300" />
                    ) : (
                      <GraduationCap className="h-3.5 w-3.5 text-emerald-300" />
                    )}
                    {data?.accessLevel ? data.accessLevel.replace('_', ' ') : 'student'}
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-slate-300 border border-white/15">
                    {profile.level || 'Beginner Scholar'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-brand-300" /> {data?.email}</span>
                  <span className="opacity-40">·</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-brand-300" /> Joined {formatDate(data?.createdAt)}</span>
                  <span className="opacity-40">·</span>
                  <span className="font-semibold text-brand-300 flex items-center gap-1">
                    <Target className="h-3.5 w-3.5" />
                    {profile.targetRole || data?.targetRole || 'Full Stack Developer'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyId}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition shadow-xs"
                title="Copy MongoDB User ID"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedId ? 'Copied!' : 'Copy ID'}</span>
              </button>
              <button
                onClick={onClose}
                className="rounded-xl p-2.5 text-slate-300 hover:bg-white/15 hover:text-white transition"
                aria-label="Close dossier"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Top 4 KPI Metric Cards in Dossier Header */}
          {!loading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 relative z-10">
              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-3.5 text-white shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Curriculum</span>
                  <Layers className="h-4 w-4 text-brand-300" />
                </div>
                <p className="mt-1 text-xl font-black">
                  {completedPhases.length}/7 <span className="text-xs font-medium text-slate-300">Phases ({curriculumPercentage}%)</span>
                </p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full bg-brand-400 rounded-full transition-all duration-500" style={{ width: `${curriculumPercentage}%` }} />
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-3.5 text-white shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Assessments</span>
                  <Award className="h-4 w-4 text-purple-300" />
                </div>
                <p className="mt-1 text-xl font-black">
                  {totalQuizzes ? `${averageScore}%` : '—'} <span className="text-xs font-medium text-slate-300">Avg ({passedQuizzes}/{totalQuizzes} Passed)</span>
                </p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${averageScore >= 80 ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ width: `${Math.min(100, averageScore)}%` }} />
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-3.5 text-white shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Coding Streak</span>
                  <Flame className="h-4 w-4 text-amber-300" />
                </div>
                <p className="mt-1 text-xl font-black">
                  {profile.streakDays || 0} <span className="text-xs font-medium text-slate-300">Days Active</span>
                </p>
                <p className="mt-1.5 text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Consistent Habit
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-3.5 text-white shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Experience Points</span>
                  <Trophy className="h-4 w-4 text-emerald-300" />
                </div>
                <p className="mt-1 text-xl font-black">
                  {data?.totalXP || profile.xpPoints || 0} <span className="text-xs font-medium text-slate-300">XP</span>
                </p>
                <p className="mt-1.5 text-[11px] font-semibold text-emerald-300">
                  {completedGoals} Goals Completed
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 overflow-x-auto gap-2 bg-slate-50/90 dark:bg-slate-950/80 shrink-0 custom-scrollbar">
          {[
            { id: 'curriculum', label: `Curriculum (${completedPhases.length}/7)`, icon: Layers },
            { id: 'quizzes', label: `Quizzes & Scores (${assessmentAttempts.length})`, icon: Award },
            { id: 'goals', label: `Goals Tracker (${totalGoals})`, icon: Target },
            { id: 'reflections', label: `Reflections & AI Mentor (${reflectionLogs.length})`, icon: Brain },
            { id: 'profile', label: 'Learner Profile & Goals', icon: UserRound },
            { id: 'activity', label: `Activity Stream (${activityLogs.length})`, icon: Activity }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-300 bg-white/80 dark:bg-slate-900/80 shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 max-h-[58vh] custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <LoaderCircle className="h-8 w-8 animate-spin text-brand-500" />
              <p className="text-sm font-semibold text-slate-500">Retrieving student records and analytics…</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 mb-3">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <p className="font-semibold text-rose-600 dark:text-rose-400">{error}</p>
            </div>
          ) : (
            <>
              {/* TAB 1: CURRICULUM */}
              {activeTab === 'curriculum' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Full-Stack MERN Curriculum Roadmap</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Live progression through all 7 curriculum phases with invested study time.</p>
                    </div>
                    <span className="rounded-xl bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-600 dark:text-brand-300">
                      {completedPhases.length} of 7 Phases Mastered
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7].map((phaseNum) => {
                      const isCompleted = completedPhases.includes(phaseNum);
                      const startDate = data?.phaseStartDates?.[phaseNum];
                      const completionDate = data?.phaseCompletionDates?.[phaseNum];
                      const daysSpent = data?.phaseDaysSpent?.[phaseNum] || 0;
                      const phaseTitle = PHASE_NAMES[phaseNum];

                      return (
                        <div
                          key={phaseNum}
                          className={`rounded-2xl border p-4.5 transition-all ${
                            isCompleted
                              ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10 shadow-xs'
                              : startDate
                                ? 'border-brand-500/40 bg-brand-500/5 dark:bg-brand-950/15 shadow-sm'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/30 opacity-60'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3.5">
                              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-sm shadow-xs ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : startDate
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                              }`}>
                                {isCompleted ? <Check className="h-5 w-5" /> : phaseNum}
                              </div>
                              <div>
                                <p className="font-bold text-sm text-slate-900 dark:text-white">{phaseTitle}</p>
                                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                  {startDate ? (
                                    <>
                                      <span>Started: <strong className="text-slate-700 dark:text-slate-300">{formatDate(startDate)}</strong></span>
                                      <span>·</span>
                                      <span>{daysSpent} {daysSpent === 1 ? 'day' : 'days'} invested</span>
                                    </>
                                  ) : (
                                    <span>Not started yet</span>
                                  )}
                                  {completionDate && (
                                    <>
                                      <span>·</span>
                                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Mastered on {formatDate(completionDate)}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                : startDate
                                  ? 'bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-500/30'
                                  : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                              {isCompleted ? 'Phase Mastered ✓' : startDate ? 'In Progress' : 'Locked'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Completed Lesson Chips */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/70 dark:bg-slate-950/40 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Completed Lessons Registry ({completedLessons.length} Finished)
                      </h5>
                      {completedLessons.length > 5 && (
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Filter lessons…"
                            value={lessonSearch}
                            onChange={(e) => setLessonSearch(e.target.value)}
                            className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
                          />
                        </div>
                      )}
                    </div>
                    {completedLessons.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No individual lessons marked complete yet.</p>
                    ) : filteredCompletedLessons.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No lessons match your filter.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar pt-1">
                        {filteredCompletedLessons.map((lessonId) => (
                          <span key={lessonId} className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 px-2.5 py-1 text-xs font-mono font-medium text-slate-800 dark:text-slate-200 shadow-2xs">
                            {lessonId}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: QUIZZES & ASSESSMENTS */}
              {activeTab === 'quizzes' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">AI-Generated Quizzes & Assessments Evaluation</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Recorded attempts with passing scores, percentage grades, and accurate answers.</p>
                    </div>
                    <span className="rounded-xl bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-700 dark:text-purple-300">
                      {assessmentAttempts.length} Submissions Logged
                    </span>
                  </div>

                  {assessmentAttempts.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <Award className="mx-auto h-10 w-10 text-slate-400 mb-2" />
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200">No Assessment Attempts Found</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        When this student completes 15-question phase assessments in the portal, their grades and performance will be automatically displayed here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {assessmentAttempts.map((attempt, index) => {
                        const isPass = attempt.passed || (attempt.score >= (attempt.passingScore || 80));
                        return (
                          <div
                            key={attempt.id || index}
                            className={`rounded-2xl border p-4.5 transition-all shadow-xs ${
                              isPass
                                ? 'border-emerald-500/30 bg-emerald-500/5'
                                : 'border-rose-500/30 bg-rose-500/5'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                  {attempt.phaseTitle || `Assessment Attempt #${index + 1}`}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                  Submitted {formatDate(attempt.timestamp || attempt.date)} · Passing benchmark: {attempt.passingScore || 80}%
                                </p>
                              </div>

                              <div className="flex items-center gap-3.5">
                                <div className="text-right">
                                  <p className="text-2xl font-black tracking-tight">{attempt.score ?? 0}%</p>
                                  <p className="text-[10px] text-slate-400 font-semibold">{attempt.correctCount ?? '—'} of {attempt.totalQuestions ?? '—'} correct</p>
                                </div>
                                <span className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-wider ${
                                  isPass
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-rose-600 text-white shadow-xs'
                                }`}>
                                  {isPass ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                  {isPass ? 'PASSED' : 'FAILED'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: GOALS TRACKER */}
              {activeTab === 'goals' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Active Goals & Milestones Tracker</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Daily coding targets, weekly milestone objectives, and monthly deliverables.</p>
                    </div>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-3 py-1 rounded-xl">
                      {completedGoals} of {totalGoals} Goals Completed
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    {/* Daily */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4.5 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">Daily Goals ({dailyGoals.length})</span>
                        <Target className="h-4 w-4 text-brand-500" />
                      </div>
                      {dailyGoals.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No daily goals created.</p>
                      ) : (
                        <div className="space-y-2">
                          {dailyGoals.map((g, i) => (
                            <div key={g.id || i} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs shadow-2xs">
                              <p className={`font-semibold ${g.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{g.title}</p>
                              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                                <span>{g.completed ? 'Done ✓' : 'In Progress'}</span>
                                <span className="text-brand-600 font-black">{g.progress || 0}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Weekly */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4.5 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">Weekly Milestones ({weeklyGoals.length})</span>
                        <Target className="h-4 w-4 text-indigo-500" />
                      </div>
                      {weeklyGoals.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No weekly milestones set.</p>
                      ) : (
                        <div className="space-y-2">
                          {weeklyGoals.map((g, i) => (
                            <div key={g.id || i} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs shadow-2xs">
                              <p className={`font-semibold ${g.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{g.title}</p>
                              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                                <span>{g.completed ? 'Done ✓' : 'In Progress'}</span>
                                <span className="text-indigo-600 font-black">{g.progress || 0}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Monthly */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4.5 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">Monthly Targets ({monthlyGoals.length})</span>
                        <Target className="h-4 w-4 text-purple-500" />
                      </div>
                      {monthlyGoals.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No monthly targets set.</p>
                      ) : (
                        <div className="space-y-2">
                          {monthlyGoals.map((g, i) => (
                            <div key={g.id || i} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs shadow-2xs">
                              <p className={`font-semibold ${g.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{g.title}</p>
                              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                                <span>{g.completed ? 'Done ✓' : 'In Progress'}</span>
                                <span className="text-purple-600 font-black">{g.progress || 0}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: REFLECTIONS & AI MENTOR */}
              {activeTab === 'reflections' && (
                <div className="space-y-6">
                  {/* Student Reflections & NVIDIA AI Feedback */}
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      Student Daily Reflections & AI Pedagogical Feedback
                    </h4>
                    <p className="text-xs text-slate-500 mb-3.5">Reflections submitted during daily coding sprints along with AI pedagogical analysis.</p>

                    {reflectionLogs.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No student reflection logs submitted yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {reflectionLogs.slice(0, 8).map((ref, idx) => (
                          <div key={ref.id || idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4.5 text-xs space-y-3 bg-slate-50/40 dark:bg-slate-950/30">
                            <div className="flex items-center justify-between text-slate-400 text-[11px]">
                              <span className="font-bold uppercase tracking-wider text-slate-500">Reflection Entry #{idx + 1}</span>
                              <span>{formatDateTime(ref.timestamp || ref.date)}</span>
                            </div>
                            <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-2xs">
                              "{ref.studentReflection || ref.text}"
                            </p>
                            {ref.aiFeedback && (
                              <div className="rounded-xl border border-brand-500/25 bg-gradient-to-r from-brand-500/10 via-indigo-500/10 to-purple-500/10 p-3.5 text-slate-800 dark:text-slate-200 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-[11px] text-brand-600 dark:text-brand-300">
                                  <Sparkles className="h-3.5 w-3.5" /> NVIDIA Llama 3.2 AI Mentor Evaluation:
                                </div>
                                <p className="leading-relaxed">{ref.aiFeedback}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AI Mentor Chat Queries */}
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      AI Mentor Interactive Chat History ({aiMentorHistory.length})
                    </h4>
                    <p className="text-xs text-slate-500 mb-3.5">Direct algorithmic and conceptual questions asked by the student.</p>

                    {aiMentorHistory.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No AI mentor queries recorded yet.</p>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 custom-scrollbar">
                        {aiMentorHistory.slice(-10).map((msg, i) => (
                          <div
                            key={i}
                            className={`p-3.5 rounded-2xl text-xs max-w-[85%] ${
                              msg.sender === 'user'
                                ? 'ml-auto bg-brand-600 text-white shadow-xs'
                                : 'mr-auto bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700 shadow-2xs'
                            }`}
                          >
                            <span className="text-[10px] font-bold block opacity-75 mb-1 uppercase tracking-wider">
                              {msg.sender === 'user' ? 'Student Question' : 'AI Mentor Solution'}
                            </span>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: PROFILE & PREFERENCES */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-950/40 space-y-2.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Role & Career Mission</p>
                      <p className="text-base font-bold text-slate-900 dark:text-white">
                        {profile.targetRole || data.targetRole || 'Full Stack Developer'}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {profile.bio || 'No personalized bio provided yet.'}
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-lg bg-slate-200/70 dark:bg-slate-800 px-2.5 py-1 font-semibold text-slate-700 dark:text-slate-300">
                          {profile.weeklyGoalHours || 20} hours / week target
                        </span>
                        <span className="rounded-lg bg-slate-200/70 dark:bg-slate-800 px-2.5 py-1 font-semibold text-slate-700 dark:text-slate-300">
                          {profile.skillsMastered || 0} skills mastered
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-950/40 space-y-2.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Authentication & System Details</p>
                      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                        <p className="flex justify-between"><span>User ID:</span> <span className="font-mono font-bold text-slate-900 dark:text-white">{data._id}</span></p>
                        <p className="flex justify-between"><span>Account Email:</span> <span className="font-semibold text-slate-900 dark:text-white">{data.email}</span></p>
                        <p className="flex justify-between"><span>Access Level:</span> <span className="font-bold uppercase text-brand-600 dark:text-brand-400">{data.accessLevel}</span></p>
                        <p className="flex justify-between"><span>Admin Request Status:</span> <span className="font-semibold">{data.adminRequestStatus || 'none'}</span></p>
                      </div>
                    </div>
                  </div>

                  {profile.preferences && (
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-950/40 space-y-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Onboarding Learning Selections</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <p className="text-slate-400 text-[11px]">Primary Goal</p>
                          <p className="font-bold mt-0.5">{profile.preferences.primaryGoal || '—'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-[11px]">Pace & Commitment</p>
                          <p className="font-bold mt-0.5">{profile.preferences.codingPace || '—'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-[11px]">Skill Level</p>
                          <p className="font-bold mt-0.5">{profile.preferences.currentLevel || '—'}</p>
                        </div>
                      </div>
                      {profile.preferences.starterStack?.length > 0 && (
                        <div>
                          <p className="text-slate-400 text-[11px] mb-1.5">Selected Technologies</p>
                          <div className="flex flex-wrap gap-1.5">
                            {profile.preferences.starterStack.map((t) => (
                              <span key={t} className="rounded-lg bg-brand-500/10 px-2.5 py-1 text-xs font-bold text-brand-600 dark:text-brand-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: ACTIVITY TIMELINE */}
              {activeTab === 'activity' && (
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Recent Student Activity Timeline</h4>
                  {activityLogs.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No activity entries logged yet.</p>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs bg-white dark:bg-slate-900">
                      {activityLogs.slice(-15).reverse().map((act, i) => (
                        <div key={act.id || i} className="p-3.5 flex items-start justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{act.title || act.type}</p>
                            {act.detail && <p className="text-slate-500 text-[11px] mt-0.5">{act.detail}</p>}
                          </div>
                          <span className="text-[11px] text-slate-400 shrink-0 font-medium">{formatDateTime(act.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 sm:px-7 flex justify-between items-center bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>StudentOS Learning Intelligence Dossier</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2 text-xs sm:text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-2xs"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN ADMIN / SUPER ADMIN DASHBOARD COMPONENT
========================================================================= */
export function AdminPanel() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isSuperAdmin = user?.accessLevel === 'super_admin';
  const superAdminOnly = location.pathname.startsWith('/super-admin');

  const [overview, setOverview] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [busyUserId, setBusyUserId] = useState('');

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'student', 'pending', 'admin', 'super_admin'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'name', 'phases', 'xp'
  const [requestFilter, setRequestFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

  // Student Inspection Modal
  const [inspectStudentId, setInspectStudentId] = useState(null);

  const refresh = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const [overviewResult, requestResult] = await Promise.all([
        apiRequest('/api/admin/overview'),
        isSuperAdmin ? apiRequest('/api/admin/requests') : Promise.resolve({ requests: [] })
      ]);
      setOverview(overviewResult);
      setRequests(requestResult.requests || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Route protection
  if (!user || !['admin', 'super_admin'].includes(user.accessLevel)) {
    return <Navigate to="/dashboard" replace />;
  }
  if (superAdminOnly && !isSuperAdmin) return <Navigate to="/admin" replace />;
  if (!superAdminOnly && isSuperAdmin) return <Navigate to="/super-admin" replace />;

  /* Formal Review Decision on Admin Request */
  const handleReview = async (userId, decision) => {
    setBusyUserId(userId);
    setError('');
    setSuccessMessage('');
    try {
      await apiRequest(`/api/admin/requests/${encodeURIComponent(userId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ decision })
      });
      setSuccessMessage(
        decision === 'approve'
          ? 'Admin request approved! The user has now been granted Administrator Access.'
          : 'Admin request was declined.'
      );
      await refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyUserId('');
    }
  };

  /* Revoke Admin Access (Super Admin Only) */
  const handleRevokeAdminAccess = async (target) => {
    if (!isSuperAdmin) {
      setError('Only Super Administrators have permission to alter admin privileges.');
      return;
    }

    if (!window.confirm(`Are you sure you want to revoke Administrator access for ${target.name || target.email}?`)) {
      return;
    }

    setBusyUserId(target._id);
    setError('');
    setSuccessMessage('');
    try {
      const res = await apiRequest(`/api/admin/users/${encodeURIComponent(target._id)}/access`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'revoke' })
      });
      setSuccessMessage(res.message || `Admin privileges revoked for ${target.email}`);
      await refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyUserId('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filtered & Sorted accounts list
  const filteredUsers = useMemo(() => {
    if (!overview?.users) return [];
    let list = overview.users.filter((account) => {
      const matchesSearch =
        (account.name && account.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (account.email && account.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (account.targetRole && account.targetRole.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesRole = true;
      if (roleFilter === 'student') matchesRole = account.accessLevel === 'student';
      else if (roleFilter === 'admin') matchesRole = account.accessLevel === 'admin';
      else if (roleFilter === 'super_admin') matchesRole = account.accessLevel === 'super_admin';
      else if (roleFilter === 'pending') matchesRole = account.adminRequestStatus === 'pending';

      return matchesSearch && matchesRole;
    });

    if (sortBy === 'name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'phases') {
      list.sort((a, b) => (b.completedPhasesCount || 0) - (a.completedPhasesCount || 0));
    } else if (sortBy === 'xp') {
      list.sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
    } else {
      // newest
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [overview?.users, searchQuery, roleFilter, sortBy]);

  const pendingRequestsCount = requests.filter((r) => r.adminRequestStatus === 'pending').length;

  const displayRequests = useMemo(() => {
    if (requestFilter === 'pending') {
      return requests.filter((r) => r.adminRequestStatus === 'pending');
    }
    if (requestFilter === 'approved') {
      return requests.filter((r) => r.adminRequestStatus === 'approved');
    }
    if (requestFilter === 'rejected') {
      return requests.filter((r) => r.adminRequestStatus === 'rejected');
    }
    return requests;
  }, [requests, requestFilter]);

  const totalRegistered = overview?.overview?.userCount ?? 0;
  const totalStudents = overview?.overview?.studentCount ?? 0;
  const totalAdmins = overview?.overview?.adminCount ?? 0;

  // Cohort Analytics
  const allUsersList = overview?.users || [];
  const totalCohortXP = allUsersList.reduce((acc, u) => acc + (u.totalXP || 0), 0);
  const totalCohortQuizzes = allUsersList.reduce((acc, u) => acc + (u.assessmentAttemptsCount || 0), 0);
  const totalMasteredPhases = allUsersList.reduce((acc, u) => acc + (u.completedPhasesCount || 0), 0);

  const stats = isSuperAdmin
    ? [
        {
          label: 'Total Platform Users',
          value: totalRegistered,
          subtext: `${totalStudents} Students · ${totalAdmins} Admins`,
          icon: Users,
          color: 'text-purple-500 bg-purple-500/10 dark:text-purple-400 dark:bg-purple-500/20'
        },
        {
          label: 'Active Students',
          value: totalStudents,
          subtext: `${totalMasteredPhases} phases mastered cohort-wide`,
          icon: BookOpen,
          color: 'text-emerald-500 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/20'
        },
        {
          label: 'Certified Admins',
          value: totalAdmins,
          subtext: 'Operational Console access active',
          icon: ShieldCheck,
          color: 'text-indigo-500 bg-indigo-500/10 dark:text-indigo-400 dark:bg-indigo-500/20'
        },
        {
          label: 'Pending Admin Requests',
          value: pendingRequestsCount,
          subtext: pendingRequestsCount > 0 ? 'Action required in inbox' : 'All requests reviewed',
          icon: Clock3,
          color: pendingRequestsCount > 0
            ? 'text-amber-500 bg-amber-500/15 dark:text-amber-400 dark:bg-amber-500/25 ring-2 ring-amber-500/30'
            : 'text-slate-500 bg-slate-500/10 dark:text-slate-400 dark:bg-slate-500/20'
        }
      ]
    : [
        {
          label: 'Monitored Learners',
          value: totalStudents,
          subtext: 'Active in 7-Phase curriculum',
          icon: Users,
          color: 'text-brand-500 bg-brand-500/10 dark:text-brand-400 dark:bg-brand-500/20'
        },
        {
          label: 'Mastered Phases Cohort',
          value: totalMasteredPhases,
          subtext: 'Full-Stack MERN milestones achieved',
          icon: Layers,
          color: 'text-emerald-500 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/20'
        },
        {
          label: 'Assessments Taken',
          value: totalCohortQuizzes,
          subtext: `${totalCohortXP.toLocaleString()} XP earned cohort-wide`,
          icon: Award,
          color: 'text-indigo-500 bg-indigo-500/10 dark:text-indigo-400 dark:bg-indigo-500/20'
        }
      ];

  return (
    <div className={`min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 relative ${
      isSuperAdmin 
        ? 'bg-gradient-to-b from-purple-950/15 via-slate-50 to-slate-100 dark:from-[#0d071a] dark:via-[#080a13] dark:to-[#04060b]'
        : 'bg-gradient-to-b from-brand-950/10 via-slate-50 to-slate-100 dark:from-[#051124] dark:via-[#080d19] dark:to-[#040710]'
    }`}>
      {/* Decorative Radial Ambient Glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none blur-3xl -z-10 ${
        isSuperAdmin
          ? 'bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-transparent'
          : 'bg-gradient-to-b from-brand-500/10 via-indigo-500/5 to-transparent'
      }`} />

      {/* Top Fixed Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/90 dark:border-slate-800/90 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3.5">
            <div className={`rounded-2xl p-2.5 shadow-md flex items-center justify-center ${
              isSuperAdmin
                ? 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-800 text-white shadow-purple-500/30'
                : 'bg-gradient-to-tr from-brand-600 via-indigo-600 to-brand-800 text-white shadow-brand-500/30'
            }`}>
              {isSuperAdmin ? <Crown className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                  {isSuperAdmin ? 'Super-Admin Control Room' : 'Administrator Operations Console'}
                </p>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                  isSuperAdmin
                    ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 shadow-2xs'
                    : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 shadow-2xs'
                }`}>
                  {isSuperAdmin ? 'Root Governance' : 'Operations Desk'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>{user.name}</span>
                <span className="opacity-40">·</span>
                <span>{user.email}</span>
                <span className="opacity-40">·</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Atlas Cluster Synced
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Back to Workspace (Admins only, Super Admin is dedicated) */}
            {!isSuperAdmin && (
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
              >
                <ArrowLeft className="h-4 w-4" /> Student Portal
              </Link>
            )}

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition"
            >
              <LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard Container */}
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Title Banner with Glassmorphism */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm relative overflow-hidden backdrop-blur-xl ${
          isSuperAdmin
            ? 'border-purple-500/25 bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-white dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-slate-900/60'
            : 'border-brand-500/25 bg-gradient-to-r from-brand-500/10 via-indigo-500/5 to-white dark:from-brand-950/30 dark:via-indigo-950/20 dark:to-slate-900/60'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-5 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                  isSuperAdmin
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-brand-600 text-white shadow-xs'
                }`}>
                  {isSuperAdmin ? <Crown className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                  {isSuperAdmin ? 'Super-Administrator Command' : 'Operational Administration'}
                </span>
                <span className="rounded-full bg-slate-200/80 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Live Cohort 2026
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {isSuperAdmin ? 'Super-Admin Platform Governance' : 'Administrator Learning Operations'}
              </h1>
              <p className="mt-2 max-w-3xl text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {isSuperAdmin
                  ? 'Manage administrative role requests from learners, inspect comprehensive student portfolios with full phase analytics, and govern platform access security.'
                  : 'Monitor student accounts, inspect curriculum progression, quiz attempts, and student goals across the learning portal.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={refresh}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 shadow-sm transition"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Telemetry
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Alerts */}
        {error && (
          <div role="alert" className="flex items-center justify-between gap-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4.5 text-sm text-rose-700 dark:text-rose-300 shadow-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
            <button onClick={() => setError('')} aria-label="Dismiss error"><X className="h-4 w-4" /></button>
          </div>
        )}
        {successMessage && (
          <div role="status" className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4.5 text-sm text-emerald-700 dark:text-emerald-300 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <span className="font-semibold">{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage('')} aria-label="Dismiss alert"><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Stats KPI Ribbon */}
        <section className={`grid gap-4 sm:gap-5 ${isSuperAdmin ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'}`}>
          {stats.map(({ label, value, subtext, icon: Icon, color }) => (
            <article
              key={label}
              className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/80 p-5 sm:p-6 shadow-xs backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 hover:shadow-lg hover:-translate-y-0.5 transition duration-300"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
                <div className={`p-2.5 rounded-2xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {loading ? <LoaderCircle className="h-8 w-8 animate-spin text-brand-500" /> : value}
              </p>
              {subtext && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {subtext}
                </p>
              )}
            </article>
          ))}
        </section>

        {/* =========================================================================
           PENDING ADMIN REQUESTS INBOX (SUPER ADMIN ONLY)
           REQUESTS SUBMITTED BY STUDENTS FROM THEIR PROFILE APPEAR HERE FOR REVIEW
        ========================================================================= */}
        {isSuperAdmin && (
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5 sm:p-6 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2.5 text-slate-900 dark:text-white">
                  <div className={`h-2.5 w-2.5 rounded-full ${pendingRequestsCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                  <span>Admin Access Requests Inbox</span>
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Learners request admin privileges from their Profile. Approving grants immediate access to the Admin Dashboard.
                </p>
              </div>

              {/* Filter Pills for Requests */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {[
                  { id: 'all', label: `All (${requests.length})` },
                  { id: 'pending', label: `Pending (${pendingRequestsCount})` },
                  { id: 'approved', label: `Approved (${requests.filter(r => r.adminRequestStatus === 'approved').length})` },
                  { id: 'rejected', label: `Rejected (${requests.filter(r => r.adminRequestStatus === 'rejected').length})` }
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setRequestFilter(id)}
                    className={`rounded-xl px-3 py-1.5 font-bold transition whitespace-nowrap ${
                      requestFilter === id
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center p-12"><LoaderCircle className="h-6 w-6 animate-spin text-brand-500" /></div>
            ) : displayRequests.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 mb-3">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {requestFilter === 'pending' ? 'No Pending Admin Access Requests' : 'No Requests Match This Filter'}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {requestFilter === 'pending'
                    ? 'When a learner navigates to their Profile and submits an administrator privilege request, their application will appear here for review.'
                    : 'Switch back to "All" to view previous decisions and application history.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayRequests.map((request) => (
                  <article key={request._id} className="flex flex-col gap-4 p-5 sm:p-6 sm:flex-row sm:items-start sm:justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <div className="min-w-0 space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 font-bold text-white text-sm">
                          {request.name ? request.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-base">{request.name || 'Account Holder'}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {request.email} · Requested on {formatDate(request.adminRequestedAt)}
                          </p>
                        </div>
                        <span className={`ml-auto sm:ml-2 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          request.adminRequestStatus === 'pending'
                            ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                            : request.adminRequestStatus === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                        }`}>{request.adminRequestStatus?.toUpperCase()}</span>
                      </div>

                      <div className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 font-medium">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stated Intent / Reason:</p>
                        "{request.adminRequestReason || 'No detailed reason provided.'}"
                      </div>

                      {request.adminRequestStatus === 'approved' && (
                        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Approved & Elevated on {formatDate(request.adminReviewedAt)} by {request.adminReviewedBy?.name || 'Super Admin'}</span>
                        </div>
                      )}
                      {request.adminRequestStatus === 'rejected' && (
                        <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-semibold pt-1">
                          <XCircle className="h-4 w-4" />
                          <span>Declined on {formatDate(request.adminReviewedAt)} by {request.adminReviewedBy?.name || 'Super Admin'}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-2 items-center sm:pt-2">
                      <button
                        onClick={() => setInspectStudentId(request._id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-brand-500/30 bg-brand-500/10 hover:bg-brand-500/20 px-3 py-2 text-xs font-bold text-brand-700 dark:text-brand-300 transition"
                      >
                        <Eye className="h-3.5 w-3.5" /> Inspect Progress
                      </button>

                      {request.adminRequestStatus === 'pending' && (
                        <>
                          <button
                            onClick={() => handleReview(request._id, 'reject')}
                            disabled={busyUserId === request._id}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800 transition"
                          >
                            <X className="h-4 w-4" /> Reject
                          </button>
                          <button
                            onClick={() => handleReview(request._id, 'approve')}
                            disabled={busyUserId === request._id}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-500 disabled:opacity-50 shadow-sm transition"
                          >
                            {busyUserId === request._id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Accept & Grant Admin
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
           ACCOUNTS DIRECTORY & DOSSIER INSPECTOR
           BOTH ADMIN AND SUPER ADMIN CAN INSPECT EVERY SINGLE STUDENT
        ========================================================================= */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 sm:p-6 dark:border-slate-800 space-y-4 bg-slate-50/70 dark:bg-slate-950/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2.5 text-slate-900 dark:text-white">
                  <UserRound className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  <span>Student & User Accounts Directory</span>
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Inspect every single student's complete portfolio, curriculum milestone progress, quizzes, and reflection notes.
                </p>
              </div>
              <span className="rounded-full bg-slate-200/80 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                {filteredUsers.length} Users Listed
              </span>
            </div>

            {/* Search, Filters, and Sorting Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="relative flex-1 min-w-[260px] max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student by name, email, or career target…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Role Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto">
                  {[
                    { id: 'all', label: 'All Users' },
                    { id: 'student', label: 'Students' },
                    { id: 'pending', label: 'Pending Requests' },
                    { id: 'admin', label: 'Admins' },
                    { id: 'super_admin', label: 'Super Admin' }
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setRoleFilter(id)}
                      className={`rounded-xl px-3 py-1.5 font-bold transition whitespace-nowrap ${
                        roleFilter === id
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Sort selector */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="name">Sort: Name</option>
                  <option value="phases">Sort: Phases Mastered</option>
                  <option value="xp">Sort: Total XP</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-16"><LoaderCircle className="h-8 w-8 animate-spin text-brand-500" /></div>
          ) : filteredUsers.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-950/70 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5 font-bold sm:px-6">Student / Account</th>
                    <th className="px-4 py-3.5 font-bold">Curriculum Milestones</th>
                    <th className="px-4 py-3.5 font-bold">Role</th>
                    <th className="px-4 py-3.5 font-bold">Enrolled</th>
                    <th className="px-4 py-3.5 font-bold text-center">Student Dossier</th>
                    {isSuperAdmin && <th className="px-5 py-3.5 font-bold text-right sm:pr-6">Admin Governance</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((account) => {
                    const isAccountSuperAdmin = account.accessLevel === 'super_admin';
                    const isAccountAdmin = account.accessLevel === 'admin';
                    const isSelf = account._id === user?._id || account.email === user?.email;
                    const hasPendingRequest = account.adminRequestStatus === 'pending';
                    const phasesMastered = account.completedPhasesCount || 0;
                    const progressPercent = Math.round((phasesMastered / 7) * 100);

                    return (
                      <tr key={account._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        {/* Column 1: Account */}
                        <td className="px-5 py-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 font-black text-white text-sm shadow-xs">
                                {account.name ? account.name[0].toUpperCase() : 'U'}
                              </div>
                              {account.emailVerified && (
                                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" title="Email Verified" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white truncate">
                                {account.name || 'Learner'} {isSelf && <span className="text-xs text-brand-600 dark:text-brand-400 font-bold">(You)</span>}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{account.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: 7-Phase Curriculum Progress with Visual Indicators */}
                        <td className="px-4 py-4 text-xs">
                          <div className="space-y-1.5 max-w-[220px]">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {phasesMastered}/7 Phases ({progressPercent}%)
                              </span>
                              <span className="font-semibold text-slate-500">{account.totalXP || 0} XP</span>
                            </div>

                            {/* 7 Segment visual bar */}
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                                <div
                                  key={num}
                                  className={`h-1.5 flex-1 rounded-full ${
                                    num <= phasesMastered
                                      ? 'bg-emerald-500'
                                      : 'bg-slate-200 dark:bg-slate-800'
                                  }`}
                                  title={`Phase ${num}: ${num <= phasesMastered ? 'Mastered' : 'Pending'}`}
                                />
                              ))}
                            </div>

                            <p className="text-[11px] text-slate-500 truncate">
                              {account.targetRole || 'Full Stack Developer'} · {account.assessmentAttemptsCount || 0} Quizzes
                            </p>
                          </div>
                        </td>

                        {/* Column 3: Role Badge */}
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                            isAccountSuperAdmin
                              ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20'
                              : isAccountAdmin
                                ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {isAccountSuperAdmin ? (
                              <Crown className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                            ) : isAccountAdmin ? (
                              <Shield className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                            ) : (
                              <GraduationCap className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                            )}
                            {account.accessLevel ? account.accessLevel.replace('_', ' ') : 'student'}
                          </span>
                        </td>

                        {/* Column 4: Joined */}
                        <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium">
                          {formatDate(account.createdAt)}
                        </td>

                        {/* Column 5: Check Data Button (AVAILABLE TO BOTH ADMIN & SUPER ADMIN) */}
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => setInspectStudentId(account._id)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-brand-500/30 bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:hover:bg-brand-900/60 dark:text-brand-300 px-3.5 py-1.5 text-xs font-bold transition shadow-2xs"
                          >
                            <Eye className="h-3.5 w-3.5" /> Check Data
                          </button>
                        </td>

                        {/* Column 6: Admin Access Status & Actions (SUPER ADMIN ONLY) */}
                        {isSuperAdmin && (
                          <td className="px-5 py-4 text-right sm:pr-6 whitespace-nowrap">
                            {isSelf || isAccountSuperAdmin ? (
                              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center justify-end gap-1">
                                <Crown className="h-3 w-3" /> Super Admin
                              </span>
                            ) : isAccountAdmin ? (
                              <button
                                onClick={() => handleRevokeAdminAccess(account)}
                                disabled={busyUserId === account._id}
                                className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300 transition"
                              >
                                {busyUserId === account._id ? (
                                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <UserMinus className="h-3.5 w-3.5" />
                                )}
                                Revoke Admin
                              </button>
                            ) : hasPendingRequest ? (
                              <button
                                onClick={() => handleReview(account._id, 'approve')}
                                disabled={busyUserId === account._id}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-3.5 py-1.5 text-xs font-black text-white shadow-xs animate-pulse transition"
                              >
                                {busyUserId === account._id ? (
                                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Check className="h-3.5 w-3.5" />
                                )}
                                Accept Request
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 font-semibold">
                                Student (No Request)
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <UserRound className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="font-bold text-sm">No accounts match your query</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try resetting your filter or search keywords.</p>
            </div>
          )}
        </section>
      </main>

      {/* STUDENT DATA INSPECTOR MODAL */}
      {inspectStudentId && (
        <StudentDetailModal
          studentId={inspectStudentId}
          onClose={() => setInspectStudentId(null)}
        />
      )}
    </div>
  );
}

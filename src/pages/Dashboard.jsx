import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { EmptyState } from '../components/common/EmptyState';
import { 
  Flame, 
  Clock, 
  Award, 
  FolderGit2, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  Bot,
  Zap,
  Target,
  Layers,
  Mic,
  Lock,
  ShieldCheck,
  CheckSquare,
  RefreshCw,
  Video,
  ChevronRight,
  Compass,
  Lightbulb,
  Plus,
  Trash2,
  Send,
  Code2,
  Check,
  Trophy,
  ArrowUpRight
} from 'lucide-react';
import { VoiceReflectionModal } from '../components/mentor/VoiceReflectionModal';
import { curriculumPhases as initialCurriculumPhases } from '../data/curriculumPhases';

const DAILY_TIPS = [
  {
    title: "React Component Purity",
    tip: "Keep components predictable by avoiding side-effects inside the render function. Always use useEffect or event handlers for mutations.",
    category: "React.js"
  },
  {
    title: "JavaScript Event Loop",
    tip: "Microtasks (Promises, queueMicrotask) always run before Macrotasks (setTimeout, setInterval). Understanding this unlocks async mastery.",
    category: "JavaScript"
  },
  {
    title: "Clean REST Architecture",
    tip: "In Express.js, separate routing from business logic using controllers and services. It makes debugging and testing 10x easier.",
    category: "Node & Express"
  },
  {
    title: "Database Performance",
    tip: "Always create compound indexes for queries that filter and sort simultaneously in MongoDB. It transforms O(N) scans into O(log N) index lookups.",
    category: "MongoDB"
  },
  {
    title: "Modern CSS Architecture",
    tip: "Use CSS Grid for major 2D page layouts and Flexbox for 1D component-level alignments. This keeps stylesheets concise and maintainable.",
    category: "CSS Layouts"
  }
];

export function Dashboard() {
  const { user } = useAuth();
  const { 
    curriculumPhases: contextCurriculumPhases,
    completedPhaseNumbers,
    isPhaseUnlocked,
    getActivePhaseNumber,
    getActivePhaseDetails,
    getPhaseDeadline,
    getPhaseDaysSpent,
    dailyGoals,
    addDailyGoal,
    toggleGoalComplete,
    deleteDailyGoal,
    submittedMiniProjects,
    skills,
    totalXP,
    sidebarCollapsed,
    simulatedLoading,
    simulatedError,
    simulatedEmpty,
    setSimulatedError,
    setSimulatedEmpty
  } = useLearning();

  const curriculumPhases = (contextCurriculumPhases && contextCurriculumPhases.length > 0) ? contextCurriculumPhases : initialCurriculumPhases;

  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState('');
  const [quickQuestion, setQuickQuestion] = useState('');

  const activeNum = getActivePhaseNumber();
  const activePhaseDetails = getActivePhaseDetails();
  const deadlineDays = getPhaseDeadline(activeNum);
  const daysSpent = getPhaseDaysSpent(activeNum);
  const currentPhaseObj = curriculumPhases.find(p => p.phaseNumber === activeNum) || curriculumPhases[0];

  // Dynamic time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '🌅', motivation: 'Ready to build momentum today?' };
    if (hour < 17) return { text: 'Good afternoon', emoji: '☀️', motivation: 'Keep that focused coding rhythm going!' };
    return { text: 'Good evening', emoji: '🌙', motivation: 'Wrapping up the day with deep work!' };
  }, []);

  // Today's tip rotating by day
  const dailyTip = useMemo(() => {
    const day = new Date().getDate();
    return DAILY_TIPS[day % DAILY_TIPS.length];
  }, []);

  // Daily goals for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayGoals = dailyGoals.filter(g => g.date === todayStr);
  const completedTodayCount = todayGoals.filter(g => g.completed || g.progress === 100).length;
  const todayProgressPercent = todayGoals.length > 0 ? Math.round((completedTodayCount / todayGoals.length) * 100) : 0;

  // Earned skills count based on completed phases
  const phaseMasteryList = [1, 2, 2.5, 3, 4, 5, 6, 7];
  const earnedSkillsCount = phaseMasteryList.filter(p => completedPhaseNumbers.includes(p)).length;
  const overallProgressionPercent = Math.round((completedPhaseNumbers.length / 7) * 100);

  const daysRemaining = Math.max(0, deadlineDays - daysSpent);
  const phasePercent = Math.min(100, Math.round((daysSpent / deadlineDays) * 100));

  // Quick Goal Handlers
  const handleAddGoalSubmit = (e) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;
    if (addDailyGoal) {
      addDailyGoal(newGoalInput.trim());
      setNewGoalInput('');
    }
  };

  const handleAddPresetGoal = (presetText) => {
    if (addDailyGoal) {
      addDailyGoal(presetText);
    }
  };

  // Quick Question to AI Mentor
  const handleQuickQuestionSubmit = (e) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    navigate('/mentor', { state: { prompt: quickQuestion.trim() } });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className={`flex-1 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} transition-all duration-300 flex flex-col min-w-0`}>
        <TopHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-8 max-w-7xl mx-auto w-full animate-fade-in">

          {simulatedLoading ? (
            <LoadingSpinner text="Fetching student analytics and active progress..." />
          ) : simulatedError ? (
            <ErrorAlert 
              title="Dashboard Data Sync Failure"
              message="Simulated error flag is enabled. Click below to clear error state."
              onRetry={() => setSimulatedError(false)}
            />
          ) : simulatedEmpty ? (
            <EmptyState 
              title="No Active Student Metrics"
              description="Simulated empty state active. Enroll in courses to start tracking progress."
              actionText="Disable Empty State"
              onAction={() => setSimulatedEmpty(false)}
            />
          ) : (
            <>
              {/* =========================================================================
                 1. HERO COMMAND CENTER BANNER WITH RADIANT AURA
              ========================================================================= */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 p-6 sm:p-8 text-white border border-indigo-500/30 shadow-2xl">
                {/* Decorative Ambient Glowing Orbs */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  
                  {/* Left Welcome Info & Progression */}
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-400/30 text-xs font-extrabold flex items-center space-x-1.5 shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                        <span>{user?.level || 'Full-Stack Scholar'}</span>
                      </span>

                      <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-mono font-bold flex items-center space-x-1.5 shadow-xs">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Phase {activeNum}: Day {daysSpent} of {deadlineDays} Days</span>
                      </span>

                      <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center space-x-1 shadow-xs">
                        <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                        <span>{user?.streakDays || 1} Day Streak</span>
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                        {greeting.text}, <span className="bg-gradient-to-r from-brand-300 via-cyan-200 to-white bg-clip-text text-transparent">{user?.name || 'Scholar'}</span>! {greeting.emoji}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-xl">
                        {greeting.motivation} You are working toward your <span className="text-cyan-300 font-bold">{user?.targetRole || 'Full Stack Developer'}</span> milestone with <strong className="text-white">{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining</strong> in Phase {activeNum}.
                      </p>
                    </div>

                    {/* Overall Program Progression Bar */}
                    <div className="pt-2 max-w-md space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span className="flex items-center space-x-1.5">
                          <Compass className="w-3.5 h-3.5 text-brand-400" />
                          <span>Full-Stack MERN Roadmap Progression</span>
                        </span>
                        <span className="font-mono text-cyan-300 font-extrabold">{overallProgressionPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400 transition-all duration-700 shadow-sm"
                          style={{ width: `${Math.max(6, overallProgressionPercent)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Quick Action Launcher Hub */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                    <Link
                      to="/curriculum"
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-brand-500/30 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5 border border-brand-400/40"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Resume Phase {activeNum} 🚀</span>
                    </Link>

                    <button
                      onClick={() => navigate('/reflections/live')}
                      className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center space-x-2 transition border border-white/15 backdrop-blur-md"
                    >
                      <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <span>Voice Reflection AI 🎙️</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/assessment"
                        className="px-3.5 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition border border-slate-800"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>15-Q Quiz</span>
                      </Link>

                      <Link
                        to="/practice"
                        className="px-3.5 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5 transition border border-slate-800"
                      >
                        <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Sandbox</span>
                      </Link>
                    </div>
                  </div>

                </div>
              </div>

              {/* =========================================================================
                 2. STATS METRICS GRID WITH INTERACTIVE LIFT
              ========================================================================= */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metric 1: Active Phase Milestone */}
                <div className="glass-card rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:border-indigo-500/50 hover:-translate-y-1 transition duration-300 group space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Phase</span>
                    <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition">
                      <Layers className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">Phase {activeNum}</p>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate mt-0.5">
                      {activePhaseDetails.title.split(':')[1] || activePhaseDetails.title}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Day {daysSpent} / {deadlineDays}</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{phasePercent}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${phasePercent}%` }} />
                    </div>
                  </div>
                </div>

                {/* Metric 2: Streak Days */}
                <div className="glass-card rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:border-amber-500/50 hover:-translate-y-1 transition duration-300 group space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Daily Streak</span>
                    <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 group-hover:scale-110 transition">
                      <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{user?.streakDays || 1} <span className="text-xs font-medium text-slate-500">Days</span></p>
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> High Consistency Habit
                    </p>
                    <p className="mt-2.5 text-[11px] text-slate-500">
                      Streak freezes auto-protect your routine on rest days.
                    </p>
                  </div>
                </div>

                {/* Metric 3: Skills Mastered */}
                <div className="glass-card rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:border-emerald-500/50 hover:-translate-y-1 transition duration-300 group space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skills Earned</span>
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{earnedSkillsCount} <span className="text-xs font-medium text-slate-500">/ 8 Badges</span></p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Verified on Phase Mastery</p>
                    <p className="mt-2.5 text-[11px] text-slate-500">
                      Total XP: <strong className="text-slate-800 dark:text-slate-200">{totalXP || user?.xpPoints || 120} XP</strong>
                    </p>
                  </div>
                </div>

                {/* Metric 4: Submitted Projects */}
                <div className="glass-card rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800/80 shadow-xs hover:border-cyan-500/50 hover:-translate-y-1 transition duration-300 group space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Projects Built</span>
                    <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{Object.keys(submittedMiniProjects || {}).length} <span className="text-xs font-medium text-slate-500">Repos</span></p>
                    <Link to="/curriculum" className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline mt-0.5 inline-flex items-center gap-1">
                      <span>View Submissions</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <p className="mt-2.5 text-[11px] text-slate-500">
                      GitHub & Live deployments recorded in portfolio.
                    </p>
                  </div>
                </div>

              </div>

              {/* =========================================================================
                 3. MAIN CONTENT GRID: TODAY'S BOUNDED AGENDA & MASTERCLASS SPOTLIGHT
              ========================================================================= */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left (2 cols): Today's Bounded Phase Agenda Checklist */}
                <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800/80 shadow-sm space-y-6 flex flex-col justify-between">
                  <div className="space-y-5">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20 uppercase tracking-wider">
                            Daily Target
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                            Day {daysSpent} of {deadlineDays} Days
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                          <CheckSquare className="w-5 h-5 text-brand-500" />
                          <span>Today's Bounded Phase Agenda</span>
                        </h2>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {completedTodayCount} / {todayGoals.length} Completed
                        </span>
                        <Link 
                          to="/goals"
                          className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition shadow-sm flex items-center space-x-1"
                        >
                          <span>Goals Hub</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Progress Bar for Today's Agenda */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span>Today's Agenda Completion</span>
                        <span className="text-brand-600 dark:text-brand-400 font-mono font-extrabold">{todayProgressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-2.5 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-800">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 transition-all duration-500 shadow-xs"
                          style={{ width: `${todayProgressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Celebratory Banner if 100% Completed */}
                    {todayGoals.length > 0 && todayProgressPercent === 100 && (
                      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-fade-in shadow-xs">
                        <Sparkles className="h-5 w-5 text-emerald-500 shrink-0" />
                        <span>Awesome work! All today's goals completed! Keep this consistency rolling into tomorrow.</span>
                      </div>
                    )}

                    {/* Daily Goals List */}
                    <div className="space-y-2.5 pt-1">
                      {todayGoals.length > 0 ? (
                        todayGoals.map(g => (
                          <div 
                            key={g.id}
                            className={`group p-3.5 sm:p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                              g.completed || g.progress === 100
                                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                                : 'bg-slate-50/80 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 hover:border-brand-500/50'
                            }`}
                          >
                            <div 
                              onClick={() => toggleGoalComplete(g.id)}
                              className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
                            >
                              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition ${
                                g.completed || g.progress === 100
                                  ? 'border-emerald-500 bg-emerald-500 text-white'
                                  : 'border-slate-300 dark:border-slate-700 hover:border-brand-500'
                              }`}>
                                {(g.completed || g.progress === 100) && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                              </div>

                              <div className="min-w-0">
                                <p className={`text-xs sm:text-sm font-bold truncate ${
                                  g.completed || g.progress === 100 ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                                }`}>
                                  {g.title}
                                </p>
                                {g.rolledOverFrom && (
                                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                                    Rolled over from {g.rolledOverFrom}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                g.completed || g.progress === 100
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                  : 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800'
                              }`}>
                                {g.completed || g.progress === 100 ? 'Done ✓' : 'In Progress'}
                              </span>

                              {deleteDailyGoal && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteDailyGoal(g.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                  title="Delete goal"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center space-y-3 bg-slate-50/80 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800">
                          <p className="text-xs text-slate-500 font-medium">No daily goals recorded for today yet.</p>
                          <p className="text-[11px] text-slate-400">Add a quick goal below or use one of the one-click presets.</p>
                        </div>
                      )}
                    </div>

                    {/* Quick Inline Add Goal Form */}
                    <form onSubmit={handleAddGoalSubmit} className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Type today's coding target (e.g., Build Responsive Navbar)..."
                        value={newGoalInput}
                        onChange={(e) => setNewGoalInput(e.target.value)}
                        className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                      />
                      <button
                        type="submit"
                        disabled={!newGoalInput.trim()}
                        className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Goal</span>
                      </button>
                    </form>

                    {/* One-Click Goal Presets Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Presets:</span>
                      {[
                        `Complete Phase ${activeNum} Lesson`,
                        'Solve 1 Code Practice Problem',
                        `Take Phase ${activeNum} 15-Q Quiz`,
                        'Record Daily Voice Reflection'
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleAddPresetGoal(preset)}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/50 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-300 border border-slate-200 dark:border-slate-700 transition"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>

                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
                    <span>Target Phase Deadline: <strong>{deadlineDays} Days</strong></span>
                    <Link to="/goals" className="font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1">
                      <span>Manage All Goals in Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right (1 col): Active Phase Masterclass & AI Wisdom */}
                <div className="space-y-6 flex flex-col justify-between">
                  {/* Masterclass Video Card */}
                  <div className="glass-panel rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
                      <div className="flex items-center space-x-2">
                        <Video className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Active Phase Masterclass</h3>
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        Phase {activeNum}
                      </span>
                    </div>

                    <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 border border-slate-800 shadow-md">
                      <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden relative group cursor-pointer border border-slate-800">
                        <iframe
                          src={currentPhaseObj?.masterVideo?.videoUrl || "https://www.youtube.com/embed/pQN-pnXPaVg"}
                          title={currentPhaseObj?.masterVideo?.title || "Masterclass"}
                          className="w-full h-full object-cover"
                          allowFullScreen
                        />
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs text-white line-clamp-1">
                          {currentPhaseObj?.masterVideo?.title || `Phase ${activeNum} Masterclass`}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {currentPhaseObj?.masterVideo?.description || "Watch the single best video masterclass for this phase."}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/curriculum"
                      className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs text-center block transition shadow-md"
                    >
                      Open Full Curriculum Hub 🚀
                    </Link>
                  </div>

                  {/* Daily AI Mentor Tip & Wisdom Card */}
                  <div className="rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 via-indigo-500/5 to-purple-500/10 dark:from-brand-950/40 dark:via-indigo-950/20 dark:to-purple-950/30 p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-300">
                        <Lightbulb className="w-4 h-4 text-amber-500 animate-pulse" />
                        <span>Daily AI Engineering Tip</span>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/25">
                        {dailyTip.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{dailyTip.title}</h4>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        "{dailyTip.tip}"
                      </p>
                    </div>

                    {/* Quick Question input to AI Mentor */}
                    <form onSubmit={handleQuickQuestionSubmit} className="pt-2 flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Ask NVIDIA AI Mentor anything…"
                        value={quickQuestion}
                        onChange={(e) => setQuickQuestion(e.target.value)}
                        className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                      <button
                        type="submit"
                        disabled={!quickQuestion.trim()}
                        className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white disabled:opacity-50 transition shadow-2xs"
                        title="Send query to AI Mentor"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>

              </div>

              {/* =========================================================================
                 4. FULL STACK 7 PHASES CURRICULUM ROADMAP GRID
              ========================================================================= */}
              <div className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
                      <Layers className="w-5 h-5 text-brand-500" />
                      <span>Full-Stack 7 Phases Engineering Roadmap</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Master each milestone sequentially to unlock the CollabSphere SaaS Capstone.</p>
                  </div>

                  <Link to="/curriculum" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline shrink-0 flex items-center space-x-1">
                    <span>Open Interactive Curriculum Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {curriculumPhases.map((phase) => {
                    const isDone = completedPhaseNumbers.includes(phase.phaseNumber);
                    const isCurrent = activeNum === phase.phaseNumber;
                    const unlocked = isPhaseUnlocked(phase.phaseNumber);

                    return (
                      <Link
                        key={phase.id}
                        to="/curriculum"
                        className={`p-5 rounded-3xl border transition duration-300 group flex flex-col justify-between space-y-4 hover:-translate-y-1 ${
                          isDone
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-500 shadow-xs'
                            : isCurrent
                            ? 'bg-brand-50/90 dark:bg-slate-900 border-brand-500 dark:border-brand-500/80 ring-2 ring-brand-500/30 shadow-md'
                            : unlocked
                            ? 'glass-card border-slate-200 dark:border-slate-800 hover:border-indigo-500'
                            : 'bg-slate-100/60 dark:bg-slate-950/60 border-slate-200/60 dark:border-slate-900 opacity-60'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full font-mono ${
                              isDone
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                : isCurrent
                                ? 'bg-brand-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}>
                              Phase {phase.phaseNumber}
                            </span>

                            {isDone ? (
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            ) : isCurrent ? (
                              <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-400" />
                            )}
                          </div>

                          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-300 transition">
                            {phase.title}
                          </h4>
                        </div>

                        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">Deadline</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{phase.deadlineDays} Days</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </main>
      </div>

      <VoiceReflectionModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
}

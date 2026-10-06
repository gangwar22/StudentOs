import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useLearning } from '../context/LearningContext';
import { curriculumPhases } from '../data/curriculumPhases';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Briefcase, 
  Save, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  Calendar,
  Github,
  Globe,
  ExternalLink,
  FolderGit2
} from 'lucide-react';

export function Profile() {
  const { user, updateProfile, requestAdminAccess, sendVerificationCode, verifyEmail } = useAuth();
  const { 
    skills,
    completedLessonIds,
    completedPhaseNumbers,
    completePhase,
    isPhaseUnlocked,
    getActivePhaseNumber,
    getActivePhaseDetails,
    getPhaseDeadline,
    getPhaseDaysSpent,
    incrementPhaseDays,
    getCourseProgress,
    submittedMiniProjects,
    sidebarCollapsed,
    simulatedLoading, 
    simulatedError, 
    simulatedEmpty, 
    setSimulatedError, 
    setSimulatedEmpty 
  } = useLearning();

  const [mobileOpen, setMobileOpen] = useState(false);

  const allMasterySkills = [
    {
      id: 'html',
      name: 'HTML5 & Web Semantics',
      courseId: 'html',
      phaseNum: 1,
      category: 'Frontend Core',
      icon: '🌐',
      topics: ['Semantic Tags', 'Forms & Validation', 'HTML5 Audio/Video', 'Accessibility & ARIA']
    },
    {
      id: 'css',
      name: 'CSS3 & Modern Layouts',
      courseId: 'css',
      phaseNum: 2,
      category: 'Frontend Core',
      icon: '🎨',
      topics: ['Flexbox Layout', 'CSS Grid', 'Media Queries', 'Animations & Transitions']
    },
    {
      id: 'javascript',
      name: 'JavaScript ES6+ & Logic',
      courseId: 'javascript',
      phaseNum: 2.5,
      category: 'Core Language',
      icon: '⚡',
      topics: ['Async / Await', 'Promises', 'DOM Manipulation', 'Event Loop & Closures']
    },
    {
      id: 'react',
      name: 'React 18 Architecture',
      courseId: 'react',
      phaseNum: 3,
      category: 'Frontend Framework',
      icon: '⚛️',
      topics: ['Components & Props', 'useState & useEffect', 'Custom Hooks', 'Context API']
    },
    {
      id: 'nodejs',
      name: 'Node.js & Server Runtime',
      courseId: 'nodejs',
      phaseNum: 4,
      category: 'Backend Core',
      icon: '🟢',
      topics: ['Event-Driven Architecture', 'File System (fs)', 'NPM Packages', 'HTTP Modules']
    },
    {
      id: 'expressjs',
      name: 'Express.js REST APIs',
      courseId: 'expressjs',
      phaseNum: 4,
      category: 'Backend Framework',
      icon: '🚀',
      topics: ['Middleware Pattern', 'Router Modules', 'JWT Authentication', 'Error Handling']
    },
    {
      id: 'mongodb',
      name: 'MongoDB & Database Design',
      courseId: 'mongodb',
      phaseNum: 5,
      category: 'Database Engineering',
      icon: '🍃',
      topics: ['Mongoose Schemas', 'CRUD Operations', 'Aggregation Pipeline', 'Data Indexing']
    },
    {
      id: 'mongodb_mongoose',
      name: 'MongoDB & Mongoose Systems',
      courseId: 'mongodb',
      phaseNum: 6,
      category: 'Database Engineering',
      icon: '💾',
      topics: ['Mongoose Schema', 'CRUD Operations', '.save() & .find()', 'MongoDB Atlas & .env']
    },
    {
      id: 'collabsphere_ai',
      name: 'Full-Stack MERN + Gemini AI Capstone',
      courseId: 'capstone',
      phaseNum: 7,
      category: 'AI & Full-Stack Systems',
      icon: '🚀',
      topics: ['JWT & Bcrypt Auth', 'CollabSphere Platform', 'Gemini AI Integration', 'Multer & Cloud Storage']
    }
  ];

  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
  ];

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    targetRole: user?.targetRole || 'Full Stack MERN Developer',
    avatar: user?.avatar || avatars[0],
    github: user?.socialLinks?.github || '',
    linkedin: user?.socialLinks?.linkedin || '',
    website: user?.socialLinks?.website || ''
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        targetRole: user.targetRole || 'Full Stack MERN Developer',
        avatar: user.avatar || avatars[0],
        github: user.socialLinks?.github || '',
        linkedin: user.socialLinks?.linkedin || '',
        website: user.socialLinks?.website || ''
      });
    }
  }, [user]);

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [adminRequestReason, setAdminRequestReason] = useState('');
  const [adminRequestError, setAdminRequestError] = useState('');
  const [adminRequestSubmitting, setAdminRequestSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [verificationSubmitting, setVerificationSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        targetRole: formData.targetRole,
        avatar: formData.avatar,
        socialLinks: {
          github: formData.github,
          linkedin: formData.linkedin,
          website: formData.website
        }
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setErrors({ form: error.message });
    }
  };

  const handleAdminRequest = async (event) => {
    event.preventDefault();
    setAdminRequestError('');
    setAdminRequestSubmitting(true);
    try {
      await requestAdminAccess(adminRequestReason);
      setAdminRequestReason('');
    } catch (error) {
      setAdminRequestError(error.message);
    } finally {
      setAdminRequestSubmitting(false);
    }
  };

  const handleSendVerification = async () => {
    setVerificationError('');
    setVerificationSubmitting(true);
    try {
      await sendVerificationCode();
      setVerificationSent(true);
    } catch (error) {
      setVerificationError(error.message);
    } finally {
      setVerificationSubmitting(false);
    }
  };

  const handleVerifyEmail = async (event) => {
    event.preventDefault();
    setVerificationError('');
    setVerificationSubmitting(true);
    try {
      await verifyEmail(verificationCode);
    } catch (error) {
      setVerificationError(error.message);
    } finally {
      setVerificationSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className={`flex-1 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} transition-all duration-300 flex flex-col min-w-0`}>
        <TopHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6 max-w-6xl mx-auto w-full">
          
          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <User className="w-7 h-7 text-brand-500 dark:text-brand-400" />
              <span>Student Profile & Workspace Settings</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Manage your personal details, target role, curriculum progression, and phase deadlines.
            </p>
          </div>

          <section className="rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-500/10 via-white to-indigo-500/10 p-5 dark:via-slate-900 dark:from-brand-950/40 dark:to-indigo-950/30 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-brand-500/15 p-3 text-brand-600 dark:text-brand-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">Admin access</h2>
                  <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                    Requests are reviewed by the super-admin and tied to your signed-in account, {user?.email}.
                  </p>
                </div>
              </div>
              {user?.accessLevel === 'super_admin' ? (
                <Link to="/super-admin" className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-purple-500 shadow-sm">
                  <ShieldCheck className="h-4 w-4" /> Open Super Admin Console <ArrowRight className="h-4 w-4" />
                </Link>
              ) : user?.accessLevel === 'admin' ? (
                <div className="flex flex-col items-start gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Administrator Access Granted
                  </span>
                  <Link to="/admin" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-500 shadow-sm">
                    Open Admin Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : user?.adminRequestStatus === 'pending' ? (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs sm:text-sm text-amber-800 dark:text-amber-200 space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-300">
                    <Clock className="h-4 w-4" /> Request Submitted to Super Admin
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    Your request for Administrator access is currently pending approval. As soon as the Super Admin reviews and accepts your request, your account will be granted Admin Dashboard access.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAdminRequest} className="w-full max-w-2xl space-y-3">
                  <label htmlFor="admin-access-reason" className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                    Request Administrator Privileges
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Need admin access to monitor student progress or review quizzes? Send a request to the Super Administrator:
                  </p>
                  <textarea
                    id="admin-access-reason"
                    value={adminRequestReason}
                    onChange={(event) => setAdminRequestReason(event.target.value)}
                    required
                    minLength={5}
                    maxLength={1000}
                    rows={3}
                    placeholder="Describe why you need admin access (e.g., student mentor, teaching assistant, course evaluator)..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                  {adminRequestError && <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">{adminRequestError}</p>}
                  {user?.adminRequestStatus === 'rejected' && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">Your previous request was declined. You can submit an updated request above.</p>
                  )}
                  <button type="submit" disabled={adminRequestSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60 shadow-sm transition">
                    {adminRequestSubmitting ? 'Sending Request…' : 'Send Admin Request to Super Admin'} <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* Data State Conditional Display */}
          {simulatedLoading ? (
            <LoadingSpinner text="Fetching user profile configuration..." />
          ) : simulatedError ? (
            <ErrorAlert 
              title="Profile Sync Failure"
              message="Simulated error flag is active. Click below to clear error state."
              onRetry={() => setSimulatedError(false)}
            />
          ) : simulatedEmpty ? (
            <EmptyState 
              title="No Profile Records"
              description="User profile is empty."
              actionText="Reset Profile Form"
              onAction={() => setSimulatedEmpty(false)}
            />
          ) : (
            <div className="space-y-8">
              
              {/* Profile Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Profile Overview Card (1 col) */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col items-center text-center shadow-sm">
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-brand-500/40 shadow-xl"
                  />

                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{formData.name}</h2>
                    <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-0.5">{formData.targetRole}</p>
                  </div>

                  <div className="w-full space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Avatar:</p>
                    <div className="flex items-center justify-center space-x-2">
                      {avatars.map((av, idx) => (
                        <img
                          key={idx}
                          src={av}
                          alt="Avatar option"
                          onClick={() => setFormData({ ...formData, avatar: av })}
                          className={`w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition ${
                            formData.avatar === av ? 'border-brand-500 scale-110' : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-left">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Level</span>
                      <span className="text-slate-900 dark:text-white font-bold">{user?.level || 'Beginner Scholar'}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>XP Points</span>
                      <span className="text-brand-600 dark:text-brand-400 font-bold">{user?.xpPoints || 0} XP</span>
                    </div>
                  </div>

                  {/* Dynamic Active Learning Phase Card */}
                  <div className="w-full bg-indigo-50/80 dark:bg-indigo-950/50 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-xs text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center space-x-1.5">
                        <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Active Phase</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-[11px] shadow-sm">
                        Phase {getActivePhaseNumber()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {getActivePhaseDetails().title}
                    </p>
                    <div className="pt-1">
                      <Link
                        to="/curriculum"
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center space-x-1"
                      >
                        <span>Go to Curriculum Hub</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Edit Form (2 cols) */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                  
                  {saveSuccess && (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="font-semibold">Profile updated successfully! All changes are saved.</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full bg-white dark:bg-slate-950 border ${errors.name ? 'border-rose-500' : 'border-slate-300 dark:border-slate-800 focus:border-brand-500'} rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition`}
                        />
                        {errors.name && <p className="mt-1 text-[11px] text-rose-500 font-medium">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          readOnly
                          className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-600 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Target Engineering Role</label>
                      <select
                        value={formData.targetRole}
                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-brand-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition"
                      >
                        <option value="Full Stack Developer">Full Stack MERN Developer</option>
                        <option value="Frontend Specialist">Frontend Engineer (React/Tailwind)</option>
                        <option value="Backend Architect">Backend Engineer (Node/Express/Mongo)</option>
                        <option value="DevOps & Cloud">DevOps & Cloud Engineer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Short Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={2}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-brand-500 rounded-xl p-4 text-xs text-slate-900 dark:text-white focus:outline-none transition leading-relaxed"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-xs">Social Profiles & Portfolio Links</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">GitHub</label>
                          <input
                            type="url"
                            value={formData.github}
                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-brand-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none transition"
                            placeholder="https://github.com/username"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">LinkedIn</label>
                          <input
                            type="url"
                            value={formData.linkedin}
                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-brand-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none transition"
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">Portfolio Website</label>
                          <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-brand-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none transition"
                            placeholder="https://yourportfolio.dev"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 inline-flex items-center space-x-2 transition"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </button>
                    {errors.form && <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">{errors.form}</p>}
                  </form>

                </div>

              </div>

              {/* STUDENT ACQUIRED SKILLS & BADGES SECTION */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                        Auto-Unlocked On Phase Completion
                      </span>
                      <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20">
                        {allMasterySkills.filter(s => (completedPhaseNumbers && completedPhaseNumbers.includes(s.phaseNum)) || getCourseProgress(s.courseId) > 0).length} Skills Earned
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                      <Award className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                      <span>Student Acquired Skills & Badges</span>
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      As you complete each phase & course in Curriculum Hub, acquired skills are automatically added to your profile!
                    </p>
                  </div>

                  <Link
                    to="/curriculum"
                    className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5 shrink-0"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Curriculum Hub ➡️</span>
                  </Link>
                </div>

                {/* Filter Acquired vs Locked Skills */}
                {(() => {
                  const acquiredSkills = allMasterySkills.filter(skill => {
                    const progress = getCourseProgress(skill.courseId);
                    const isPhaseDone = completedPhaseNumbers.includes(skill.phaseNum);
                    return isPhaseDone || progress > 0;
                  });

                  const lockedSkills = allMasterySkills.filter(skill => {
                    const progress = getCourseProgress(skill.courseId);
                    const isPhaseDone = completedPhaseNumbers.includes(skill.phaseNum);
                    return !isPhaseDone && progress === 0;
                  });

                  return (
                    <div className="space-y-6">
                      
                      {/* Acquired Skills Grid */}
                      {acquiredSkills.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {acquiredSkills.map((skill) => {
                            const courseProgress = getCourseProgress(skill.courseId);
                            const isPhaseDone = completedPhaseNumbers.includes(skill.phaseNum);
                            const progressPercent = isPhaseDone ? 100 : Math.max(courseProgress, 50);

                            return (
                              <div
                                key={skill.id}
                                className="p-5 rounded-3xl border bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30 shadow-sm transition hover:shadow-md space-y-4"
                              >
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2.5">
                                      <span className="text-2xl">{skill.icon}</span>
                                      <div>
                                        <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{skill.name}</h4>
                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{skill.category}</span>
                                      </div>
                                    </div>

                                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 shadow-2xs">
                                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                      <span>Acquired ✓</span>
                                    </span>
                                  </div>

                                  {/* Mastery Progress Bar */}
                                  <div className="space-y-1 pt-1">
                                    <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400">
                                      <span>Phase {skill.phaseNum} Mastery</span>
                                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {progressPercent}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                                      <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                  </div>

                                  {/* Topic Badges */}
                                  <div className="flex flex-wrap gap-1 pt-1">
                                    {skill.topics.map((t, i) => (
                                      <span
                                        key={i}
                                        className="text-[10px] px-2 py-0.5 rounded-lg border bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 font-medium"
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* EMPTY STATE WHEN NO SKILLS UNLOCKED YET */
                        <div className="bg-slate-50 dark:bg-slate-950/80 rounded-3xl p-8 text-center space-y-4 border border-slate-200 dark:border-slate-800 max-w-xl mx-auto">
                          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                            <Award className="w-7 h-7" />
                          </div>
                          <div className="space-y-1.5">
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">No Skills Acquired Yet</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                              Complete Phase 1 (Foundations of Web) in your Curriculum Hub to auto-unlock your first verified skill badge (HTML5 & Web Semantics) on your profile!
                            </p>
                          </div>
                          <Link
                            to="/curriculum"
                            className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md inline-flex items-center space-x-2 transition"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>Unlock First Skill in Phase 1 🚀</span>
                          </Link>
                        </div>
                      )}

                      {/* UPCOMING / LOCKED SKILLS COLLAPSIBLE SECTION */}
                      {lockedSkills.length > 0 && (
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Upcoming Skills to Unlock ({lockedSkills.length}):</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 opacity-75">
                            {lockedSkills.map((skill) => (
                              <div
                                key={skill.id}
                                className="p-4 rounded-2xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xl opacity-60">{skill.icon}</span>
                                    <div>
                                      <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">{skill.name}</h5>
                                      <span className="text-[10px] text-slate-400">{skill.category}</span>
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    Phase {skill.phaseNum} 🔒
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })()}

              </div>

              {/* STUDENT SUBMITTED PROJECTS & PORTFOLIO LINKS SECTION */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                        Verified Student Repositories & Deployments
                      </span>
                      <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
                        {Object.keys(submittedMiniProjects || {}).length} Projects Submitted
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                      <FolderGit2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      <span>Student Submitted Projects Portfolio</span>
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      GitHub repository source links and live deployment URLs submitted by you across all curriculum phases.
                    </p>
                  </div>

                  <Link
                    to="/curriculum"
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5 shrink-0"
                  >
                    <FolderGit2 className="w-4 h-4" />
                    <span>Submit More Projects ➡️</span>
                  </Link>
                </div>

                {Object.keys(submittedMiniProjects || {}).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(submittedMiniProjects).map(([key, item]) => (
                      <div
                        key={key}
                        className="p-5 rounded-2xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:border-indigo-500/50 transition flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
                              Phase {item.phaseNumber}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(item.submittedAt).toLocaleDateString()}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                            {item.projectTitle}
                          </h4>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                          {item.githubUrl && (
                            <a
                              href={item.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-800 text-[11px] font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition"
                            >
                              <Github className="w-3.5 h-3.5 text-amber-400" />
                              <span>GitHub Code</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          )}
                          {item.deployUrl && (
                            <a
                              href={item.deployUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-semibold flex items-center gap-1.5 hover:bg-indigo-500 transition"
                            >
                              <Globe className="w-3.5 h-3.5 text-cyan-300" />
                              <span>Live App</span>
                              <ExternalLink className="w-3 h-3 text-indigo-200" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-2xl text-center border border-slate-200 dark:border-slate-800 space-y-3">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No project submissions added yet.</p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Go to Curriculum Hub, select any phase (Phases 1 to 7), click "Projects & Submissions", and paste your GitHub & Live Deploy links!
                    </p>
                    <Link
                      to="/curriculum"
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md inline-flex items-center gap-1.5 transition"
                    >
                      <FolderGit2 className="w-4 h-4" />
                      <span>Go to Curriculum Hub to Submit Links</span>
                    </Link>
                  </div>
                )}
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { EmptyState } from '../components/common/EmptyState';
import { useLearning } from '../context/LearningContext';
import { curriculumPhases as initialCurriculumPhases } from '../data/curriculumPhases';
import { 
  BookOpen, 
  Code2, 
  Clock, 
  Video, 
  CheckCircle2, 
  HelpCircle, 
  ExternalLink, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Layers, 
  Award,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Terminal,
  Zap,
  Lock,
  Unlock,
  RotateCcw,
  Github,
  Globe,
  Send,
  FileCode2,
  Check,
  FolderGit2
} from 'lucide-react';

export function Curriculum() {
  const { 
    curriculumPhases: contextCurriculumPhases,
    simulatedLoading, 
    simulatedError, 
    simulatedEmpty, 
    setSimulatedError, 
    setSimulatedEmpty,
    completedPhaseNumbers,
    completePhase,
    getPhaseCompletionRequirements,
    isPhaseUnlocked,
    getActivePhaseNumber,
    getActivePhaseDetails,
    resetPhaseProgression,
    getPhaseDeadline,
    getPhaseDaysSpent,
    submitMiniProject,
    getMiniProjectSubmission,
    sidebarCollapsed
  } = useLearning();

  const curriculumPhases = (contextCurriculumPhases && contextCurriculumPhases.length > 0) ? contextCurriculumPhases : initialCurriculumPhases;

  const [mobileOpen, setMobileOpen] = useState(false);
  const activePhaseNumber = getActivePhaseNumber();
  const activePhaseDetails = getActivePhaseDetails();

  const [selectedPhase, setSelectedPhase] = useState(() => {
    return curriculumPhases.find(p => p.phaseNumber === activePhaseNumber) || curriculumPhases[0];
  });

  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' | 'projects' | 'videos'
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  // Expanded video index state for video checklist prompts
  const [expandedVideoIdx, setExpandedVideoIdx] = useState(null);

  // Form state for mini project submission per card
  const [submissionForms, setSubmissionForms] = useState({});
  const [submissionSuccess, setSubmissionSuccess] = useState({});

  useEffect(() => {
    if (curriculumPhases && curriculumPhases.length > 0) {
      setSelectedPhase(prev => {
        if (!prev) return curriculumPhases.find(p => p.phaseNumber === activePhaseNumber) || curriculumPhases[0];
        const match = curriculumPhases.find(p => p.id === prev.id || p.phaseNumber === prev.phaseNumber);
        return match || curriculumPhases[0];
      });
    }
  }, [activePhaseNumber, curriculumPhases]);

  const unlocked = selectedPhase ? isPhaseUnlocked(selectedPhase.phaseNumber) : false;

  const handleFormChange = (miniTitle, field, value) => {
    setSubmissionForms(prev => ({
      ...prev,
      [miniTitle]: {
        ...(prev[miniTitle] || {}),
        [field]: value
      }
    }));
  };

  const handleMiniProjectSubmit = (e, miniTitle) => {
    e.preventDefault();
    const existing = getMiniProjectSubmission(selectedPhase.phaseNumber, miniTitle) || {};
    const formData = submissionForms[miniTitle] || {};
    
    const githubUrl = formData.githubUrl !== undefined ? formData.githubUrl : (existing.githubUrl || '');
    const deployUrl = formData.deployUrl !== undefined ? formData.deployUrl : (existing.deployUrl || '');

    if (!githubUrl.trim() || !deployUrl.trim()) {
      alert('Please enter BOTH GitHub Repository URL and Live Deployment Link before submitting this project.');
      return;
    }

    submitMiniProject({
      phaseNumber: selectedPhase.phaseNumber,
      projectTitle: miniTitle,
      githubUrl: githubUrl.trim(),
      deployUrl: deployUrl.trim()
    });

    setSubmissionSuccess(prev => ({ ...prev, [miniTitle]: true }));
    setTimeout(() => {
      setSubmissionSuccess(prev => ({ ...prev, [miniTitle]: false }));
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className={`flex-1 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} transition-all duration-300 flex flex-col min-w-0`}>
        <TopHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6 max-w-7xl mx-auto w-full">


          {/* Header Title Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                <BookOpen className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                <span>Curriculum & Project Hub</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Sequential progression system: Master each phase, complete mini projects, and submit source links!
              </p>
            </div>

            <button
              onClick={resetPhaseProgression}
              title="Reset Progression (Lock Phases)"
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-xs self-start md:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Locks</span>
            </button>
          </div>

          {/* Phase Stepper Timeline Header */}
          <div className="bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
            <div className="flex items-center space-x-2 min-w-max">
              {curriculumPhases.map((phase) => {
                const phaseUnlocked = isPhaseUnlocked(phase.phaseNumber);
                const isSelected = selectedPhase.id === phase.id;
                const isCompleted = completedPhaseNumbers.includes(phase.phaseNumber);
                const isCurrentActive = phase.phaseNumber === activePhaseNumber;

                return (
                  <button
                    key={phase.id}
                    onClick={() => setSelectedPhase(phase)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2.5 border ${
                      isSelected
                        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 border-brand-500 text-white shadow-md shadow-brand-500/20'
                        : phaseUnlocked
                        ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'bg-slate-100/50 dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-900 text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      {isCompleted ? (
                        <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-emerald-300' : 'text-emerald-600 dark:text-emerald-400'}`} />
                      ) : phaseUnlocked ? (
                        <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-mono font-extrabold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-brand-600 dark:text-brand-400'
                        }`}>
                          P{phase.phaseNumber}
                        </span>
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                    </span>
                    
                    <span className="truncate max-w-[130px]">
                      {phase.title.split(':')[0] || phase.title}
                    </span>

                    {isCurrentActive && !isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data State Conditional Display */}
          {simulatedLoading ? (
            <LoadingSpinner text="Rendering curriculum document specifications..." />
          ) : simulatedError ? (
            <ErrorAlert 
              title="Failed to render curriculum specs"
              message="Simulated error flag is active. Click below to clear error state."
              onRetry={() => setSimulatedError(false)}
            />
          ) : simulatedEmpty ? (
            <EmptyState 
              title="No Curriculum Phases Found"
              description="Reset phase viewer to view project specifications."
              actionText="Reset Curriculum Hub"
              onAction={() => setSimulatedEmpty(false)}
            />
          ) : (
            <div className="space-y-6 animate-fade-in">

              {/* Active Selected Phase Hero Banner */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white dark:from-slate-900 via-slate-50 dark:via-slate-900 to-indigo-500/10 dark:to-indigo-950/40 space-y-5 shadow-sm">
                
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20">
                      {selectedPhase.badge}
                    </span>
                    
                    {selectedPhase.phaseNumber === activePhaseNumber && (
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-600 text-white shadow-sm flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Current Active Phase</span>
                      </span>
                    )}

                    {unlocked ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <Unlock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1.5 shadow-xs">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Deadline: <strong>{getPhaseDeadline(selectedPhase.phaseNumber)} Days</strong></span>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-indigo-700 dark:text-indigo-400 font-semibold flex items-center gap-1.5 shadow-xs">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Time Spent: <strong>{getPhaseDaysSpent(selectedPhase.phaseNumber)} Days</strong></span>
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl font-bold border shadow-xs ${
                      completedPhaseNumbers.includes(selectedPhase.phaseNumber)
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}>
                      {completedPhaseNumbers.includes(selectedPhase.phaseNumber) ? 'Completed 🎉' : 'In Progress'}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {selectedPhase.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed max-w-4xl">
                    {selectedPhase.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    to="/assessment"
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-brand-500/20 transition"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Launch Quiz Master (15-Q)</span>
                  </Link>
                  <Link
                    to="/practice"
                    className="px-5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 transition"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Open Code Sandbox</span>
                  </Link>
                </div>
              </div>

              {/* LOCKED PHASE OVERLAY IF LOCKED */}
              {!unlocked ? (
                <div className="glass-card rounded-3xl p-8 border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-slate-950/90 text-center space-y-6">
                  <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
                    <Lock className="w-8 h-8" />
                  </div>

                  <div className="space-y-2 max-w-lg mx-auto">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Phase {selectedPhase.phaseNumber} is Locked!</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      You must complete <strong className="text-brand-600 dark:text-brand-400">Phase {selectedPhase.phaseNumber === 2 ? 1 : selectedPhase.phaseNumber === 2.5 ? 2 : selectedPhase.phaseNumber === 3 ? 2.5 : selectedPhase.phaseNumber === 4 ? 3 : 4}</strong> first to unlock this phase!
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        const prevPhaseNum = selectedPhase.phaseNumber === 2 ? 1 : selectedPhase.phaseNumber === 2.5 ? 2 : selectedPhase.phaseNumber === 3 ? 2.5 : selectedPhase.phaseNumber === 4 ? 3 : 4;
                        const prevPhaseObj = curriculumPhases.find(p => p.phaseNumber === prevPhaseNum) || curriculumPhases[0];
                        setSelectedPhase(prevPhaseObj);
                      }}
                      className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 transition flex items-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Go to Phase Deliverables & Submit 🚀</span>
                    </button>
                    <button
                      onClick={() => setSelectedPhase(curriculumPhases[0])}
                      className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition"
                    >
                      Return to Phase 1
                    </button>
                  </div>
                </div>
              ) : (
                <>

                  {/* MODERN TAB NAVIGATION FOR UNCLUTTERED VIEW */}
                  <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
                    {[
                      { id: 'overview', label: 'Overview & Concepts', icon: Zap },
                      { id: 'projects', label: 'Mini Projects & Submissions', icon: FolderGit2, badge: selectedPhase.miniProjects?.length || 0 },
                      { id: 'videos', label: 'Video Tutorials & Checklist', icon: Video },
                      { id: 'rubrics', label: 'Rubrics & Resources', icon: ShieldCheck }
                    ].map(tab => {
                      const IconComp = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 border ${
                            isActive
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <IconComp className={`w-4 h-4 ${isActive ? 'text-amber-400 dark:text-brand-600' : 'text-slate-400'}`} />
                          <span>{tab.label}</span>
                          {tab.badge !== undefined && tab.badge > 0 && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              isActive ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}>
                              {tab.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* TAB 1: OVERVIEW & CONCEPTS */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fade-in">
                      
                      {/* Project Introduction */}
                      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center space-x-2">
                          <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                          <span>{selectedPhase.introduction?.title || '1. Project Introduction'}</span>
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          {selectedPhase.introduction?.welcomeMessage}
                        </p>

                        {selectedPhase.introduction?.es6Explanation && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 space-y-2">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Why ES6+ Matters:</span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{selectedPhase.introduction.es6Explanation}</p>
                          </div>
                        )}

                        {selectedPhase.introduction?.backendAnalogy && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-2">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">The Kitchen Analogy (Client vs Server):</span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{selectedPhase.introduction.backendAnalogy}</p>
                          </div>
                        )}

                        {selectedPhase.introduction?.toolsExplanation && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 space-y-2">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Node.js, Express.js & Gemini AI:</span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{selectedPhase.introduction.toolsExplanation}</p>
                          </div>
                        )}

                        {selectedPhase.introduction?.apiExplanation && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-brand-200 dark:border-brand-900/50 space-y-2">
                            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block">APIs & Google Gemini Integration:</span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{selectedPhase.introduction.apiExplanation}</p>
                          </div>
                        )}

                        {selectedPhase.introduction?.containedPages && (
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Quiz Master Pages & App Flow:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {selectedPhase.introduction.containedPages.map((pg, idx) => (
                                <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                                  <span className="font-bold text-brand-600 dark:text-brand-300 text-xs">{pg.name}</span>
                                  <p className="text-[11px] text-slate-600 dark:text-slate-400">{pg.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedPhase.introduction?.containedFeatures && (
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Application Modules to Build:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              {selectedPhase.introduction.containedFeatures.map((feat, idx) => (
                                <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                                  <span className="font-bold text-brand-600 dark:text-brand-300 text-xs">{feat.name}</span>
                                  <p className="text-[11px] text-slate-600 dark:text-slate-400">{feat.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* PAGE-BY-PAGE HTML CONCEPT LEARNING GUIDE (PAGE 1 TO PAGE 6) */}
                      {selectedPhase.pageBreakdown && (
                        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                                Detailed Curriculum Syllabus
                              </span>
                              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2 mt-1">
                                <BookOpen className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                                <span>Page-by-Page HTML Concept Learning Guide (Page 1 to Page 6)</span>
                              </h3>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                Follow this exact page-by-page blueprint to know precisely what HTML tags, semantic elements, and concepts to study for each page.
                              </p>
                            </div>
                            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shrink-0 self-start sm:self-auto">
                              6 HTML Pages Total
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {selectedPhase.pageBreakdown.map((page, idx) => (
                              <div
                                key={idx}
                                className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 transition space-y-4 shadow-sm flex flex-col justify-between"
                              >
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-2xl">{page.icon}</span>
                                      <div>
                                        <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 font-mono bg-brand-500/10 px-2 py-0.5 rounded">
                                          {page.fileName}
                                        </span>
                                        <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5">
                                          {page.title}
                                        </h4>
                                      </div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg shrink-0">
                                      ⏱️ {page.maxTime}
                                    </span>
                                  </div>

                                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {page.desc}
                                  </p>

                                  {/* Concepts To Study Checklist */}
                                  {page.conceptsToStudy && (
                                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-900">
                                      <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                                        Concepts & Topics to Study:
                                      </span>
                                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                                        {page.conceptsToStudy.map((c, cIdx) => (
                                          <li key={cIdx} className="flex items-start space-x-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                            <span className="leading-snug">{c}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                {/* HTML Tags Used */}
                                {page.tags && (
                                  <div className="pt-3 border-t border-slate-100 dark:border-slate-900 space-y-1.5">
                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                                      HTML Tags to Use:
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {page.tags.map((t, tIdx) => (
                                        <span
                                          key={tIdx}
                                          className="text-[10px] font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded"
                                        >
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Backend Concepts Matrix Table (if Phase 5) */}
                      {selectedPhase.backendConceptsTable && (
                        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4 overflow-x-auto">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                            <Terminal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <span>Backend Concepts & Express Architecture Matrix</span>
                          </h3>

                          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                            <thead>
                              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
                                <th className="p-3 font-bold">Feature / Task</th>
                                <th className="p-3 font-bold text-emerald-600 dark:text-emerald-400">Backend Concept</th>
                                <th className="p-3 font-bold text-brand-600 dark:text-brand-400">Why It's Important for Your Project</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                              {selectedPhase.backendConceptsTable.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-100 dark:hover:bg-slate-900/40 transition">
                                  <td className="p-3 font-bold text-slate-900 dark:text-white">{row.feature}</td>
                                  <td className="p-3 font-mono text-cyan-600 dark:text-cyan-300">{row.concept}</td>
                                  <td className="p-3 text-slate-700 dark:text-slate-300 leading-relaxed">{row.why}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* ES6 Concepts Matrix Table (if Phase 4) */}
                      {selectedPhase.es6ConceptsTable && (
                        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4 overflow-x-auto">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <span>ES6+ & API Concepts Applied in This Project</span>
                          </h3>

                          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                            <thead>
                              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
                                <th className="p-3 font-bold">Feature of Your App</th>
                                <th className="p-3 font-bold text-indigo-600 dark:text-indigo-400">ES6 / JS Concept</th>
                                <th className="p-3 font-bold text-emerald-600 dark:text-emerald-400">Why It's Used & Rationale</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                              {selectedPhase.es6ConceptsTable.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-100 dark:hover:bg-slate-900/40 transition">
                                  <td className="p-3 font-bold text-slate-900 dark:text-white">{row.feature}</td>
                                  <td className="p-3 font-mono text-cyan-600 dark:text-cyan-300">{row.concept}</td>
                                  <td className="p-3 text-slate-700 dark:text-slate-300 leading-relaxed">{row.why}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Quiz Master Features Table */}
                      {selectedPhase.quizFeatures && (
                        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4 overflow-x-auto">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                            <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                            <span>Feature-by-Feature Learning Breakdown</span>
                          </h3>

                          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                            <thead>
                              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
                                <th className="p-3 font-bold">Feature / Page</th>
                                <th className="p-3 font-bold text-brand-600 dark:text-brand-400">Key JS Concepts</th>
                                <th className="p-3 font-bold text-emerald-600 dark:text-emerald-400">Learning Guidance</th>
                                <th className="p-3 font-bold text-amber-600 dark:text-amber-400">Resource Hint</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                              {selectedPhase.quizFeatures.map((feat, idx) => (
                                <tr key={idx} className="hover:bg-slate-100 dark:hover:bg-slate-900/40 transition">
                                  <td className="p-3 font-bold text-slate-900 dark:text-white">{feat.feature}</td>
                                  <td className="p-3 font-mono text-cyan-600 dark:text-cyan-300">{feat.concepts}</td>
                                  <td className="p-3 text-slate-700 dark:text-slate-300 leading-relaxed">{feat.guidance}</td>
                                  <td className="p-3 text-amber-700 dark:text-amber-300 font-medium leading-relaxed">{feat.resourceHint}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                    </div>
                  )}

                  {/* TAB 2: MINI & MAIN PROJECTS SUBMISSIONS */}
                  {activeTab === 'projects' && (() => {
                    const mainProjectTitle = selectedPhase.mainProject?.title || selectedPhase.title;
                    const mainProjectDesc = selectedPhase.mainProject?.desc || selectedPhase.subtitle || selectedPhase.introduction?.welcomeMessage;
                    const mainProjKey = `Main Project: Phase ${selectedPhase.phaseNumber} - ${mainProjectTitle}`;
                    const mainSubmission = getMiniProjectSubmission(selectedPhase.phaseNumber, mainProjKey);
                    const mainFormData = submissionForms[mainProjKey] || {
                      githubUrl: mainSubmission?.githubUrl || '',
                      deployUrl: mainSubmission?.deployUrl || ''
                    };
                    const isMainSubmitted = !!mainSubmission;
                    const isMainSuccess = submissionSuccess[mainProjKey];

                    return (
                      <div className="space-y-8 animate-fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                              <FolderGit2 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                              <span>Phase {selectedPhase.phaseNumber} Projects & Student Submissions</span>
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                              Submit your GitHub source code repository and live deployment URL for the Main Project and Mini Projects.
                            </p>
                          </div>

                          <Link
                            to="/practice"
                            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5 shrink-0"
                          >
                            <span>Open Code Sandbox</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>

                        {/* FEATURED MAIN CAPSTONE PROJECT SUBMISSION CARD */}
                        <div className="glass-card rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/40 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 via-white dark:via-slate-900 to-brand-500/5 space-y-6 shadow-md">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-brand-600 text-white shadow-sm flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Main Phase Project Submission</span>
                              </span>
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
                                Phase {selectedPhase.phaseNumber} Final Build
                              </span>
                            </div>

                            {isMainSubmitted ? (
                              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 shadow-xs">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Main Project Submitted ✓</span>
                              </span>
                            ) : (
                              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-amber-500" />
                                <span>Pending Main Project Submission ⏳</span>
                              </span>
                            )}
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                              <FolderGit2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                              <span>{mainProjectTitle}</span>
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {mainProjectDesc}
                            </p>
                          </div>

                          {/* Success Alert */}
                          {isMainSuccess && (
                            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>Main project submission saved successfully!</span>
                            </div>
                          )}

                          {/* Active Submission Preview */}
                          {isMainSubmitted && (
                            <div className="p-4 bg-white/80 dark:bg-slate-950/80 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-2.5 text-xs">
                              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Main Submission Active
                                </span>
                                <span className="font-mono text-[11px]">Submitted: {new Date(mainSubmission.submittedAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex flex-wrap gap-3 pt-1">
                                {mainSubmission.githubUrl && (
                                  <a
                                    href={mainSubmission.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-800 text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition shadow-xs"
                                  >
                                    <Github className="w-4 h-4 text-amber-400" />
                                    <span>View GitHub Repository</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                  </a>
                                )}
                                {mainSubmission.deployUrl && (
                                  <a
                                    href={mainSubmission.deployUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-indigo-500 transition shadow-xs"
                                  >
                                    <Globe className="w-4 h-4 text-cyan-300" />
                                    <span>View Live Deployment</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-indigo-200" />
                                  </a>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Submission Form */}
                          <form onSubmit={(e) => handleMiniProjectSubmit(e, mainProjKey)} className="space-y-4 pt-2 border-t border-indigo-100 dark:border-slate-800/80">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                                  <Github className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                                  <span>GitHub Source Repository URL *</span>
                                </label>
                                <input
                                  type="url"
                                  value={mainFormData.githubUrl || ''}
                                  onChange={(e) => handleFormChange(mainProjKey, 'githubUrl', e.target.value)}
                                  placeholder={`https://github.com/username/phase-${selectedPhase.phaseNumber}-main-project`}
                                  required
                                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none transition shadow-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                                  <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                  <span>Live Deployment URL (Vercel / Netlify / Render / GitHub Pages)</span>
                                </label>
                                <input
                                  type="url"
                                  value={mainFormData.deployUrl || ''}
                                  onChange={(e) => handleFormChange(mainProjKey, 'deployUrl', e.target.value)}
                                  placeholder={`https://phase-${selectedPhase.phaseNumber}-main-app.vercel.app`}
                                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none transition shadow-xs"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className={`w-full py-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-2 shadow-md ${
                                isMainSubmitted 
                                  ? 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white' 
                                  : 'bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white shadow-indigo-500/20'
                              }`}
                            >
                              <Send className="w-4 h-4" />
                              <span>{isMainSubmitted ? 'Update Main Project Links' : `Submit Phase ${selectedPhase.phaseNumber} Main Project`}</span>
                            </button>
                          </form>
                        </div>

                        {/* MINI PROJECTS SECTION HEADER */}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                              <Code2 className="w-5 h-5 text-amber-500" />
                              <span>Phase {selectedPhase.phaseNumber} Mini Projects ({selectedPhase.miniProjects?.length || 0})</span>
                            </h4>
                          </div>

                          {selectedPhase.miniProjects && selectedPhase.miniProjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {selectedPhase.miniProjects.map((mini, idx) => {
                                const submission = getMiniProjectSubmission(selectedPhase.phaseNumber, mini.title);
                                const formData = submissionForms[mini.title] || {
                                  githubUrl: submission?.githubUrl || '',
                                  deployUrl: submission?.deployUrl || ''
                                };
                                const isSubmitted = !!submission;
                                const isSuccess = submissionSuccess[mini.title];

                                return (
                                  <div 
                                    key={idx} 
                                    className={`glass-card rounded-3xl p-6 border transition space-y-5 flex flex-col justify-between ${
                                      isSubmitted 
                                        ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/10' 
                                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                                    }`}
                                  >
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold px-2.5 py-1 rounded-full border border-amber-500/20">
                                          Mini Project #{idx + 1}
                                        </span>

                                        {isSubmitted ? (
                                          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 shadow-xs">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                            <span>Submitted ✓</span>
                                          </span>
                                        ) : (
                                          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                            Pending Submission ⏳
                                          </span>
                                        )}
                                      </div>

                                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{mini.title}</h4>
                                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{mini.desc}</p>
                                      
                                      {mini.tags && (
                                        <div className="flex flex-wrap gap-1 pt-1">
                                          {mini.tags.map((t, i) => (
                                            <span key={i} className="text-[10px] font-mono bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-amber-700 dark:text-amber-200 px-2 py-0.5 rounded">
                                              {t}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    {/* Submission Details & Form */}
                                    <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                                      
                                      {isSuccess && (
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                          <span>Mini project submission saved successfully!</span>
                                        </div>
                                      )}

                                      {isSubmitted && (
                                        <div className="p-3.5 bg-slate-100/80 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                                          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                            <span>Last Submission:</span>
                                            <span className="font-mono">{new Date(submission.submittedAt).toLocaleDateString()}</span>
                                          </div>
                                          <div className="flex flex-wrap gap-2 pt-1">
                                            {submission.githubUrl && (
                                              <a
                                                href={submission.githubUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-800 text-[11px] font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition"
                                              >
                                                <Github className="w-3.5 h-3.5 text-amber-400" />
                                                <span>View GitHub Code</span>
                                                <ExternalLink className="w-3 h-3 text-slate-400" />
                                              </a>
                                            )}
                                            {submission.deployUrl && (
                                              <a
                                                href={submission.deployUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-semibold flex items-center gap-1.5 hover:bg-indigo-500 transition"
                                              >
                                                <Globe className="w-3.5 h-3.5 text-cyan-300" />
                                                <span>View Live App</span>
                                                <ExternalLink className="w-3 h-3 text-indigo-200" />
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                      <form onSubmit={(e) => handleMiniProjectSubmit(e, mini.title)} className="space-y-3">
                                        <div>
                                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                                            <Github className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                                            <span>GitHub Source Repository URL *</span>
                                          </label>
                                          <input
                                            type="url"
                                            value={formData.githubUrl || ''}
                                            onChange={(e) => handleFormChange(mini.title, 'githubUrl', e.target.value)}
                                            placeholder="https://github.com/username/mini-project"
                                            required
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-brand-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none transition"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                                            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                            <span>Live Deployment Link (Vercel/Netlify/GitHub Pages)</span>
                                          </label>
                                          <input
                                            type="url"
                                            value={formData.deployUrl || ''}
                                            onChange={(e) => handleFormChange(mini.title, 'deployUrl', e.target.value)}
                                            placeholder="https://my-project.vercel.app"
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-brand-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none transition"
                                          />
                                        </div>

                                        <button
                                          type="submit"
                                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md ${
                                            isSubmitted 
                                              ? 'bg-slate-800 dark:bg-slate-800 hover:bg-slate-700 text-white' 
                                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                                          }`}
                                        >
                                          <Send className="w-3.5 h-3.5" />
                                          <span>{isSubmitted ? 'Update Submission Links' : 'Submit Mini Project'}</span>
                                        </button>
                                      </form>

                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="glass-card rounded-3xl p-8 text-center text-slate-500 space-y-2">
                              <p className="text-sm font-semibold">No additional mini projects assigned for Phase {selectedPhase.phaseNumber}.</p>
                              <p className="text-xs">Complete the Main Capstone Project submission above!</p>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })()}

                  {/* TAB 3: VIDEO TUTORIALS & CHECKLIST */}
                  {activeTab === 'videos' && (
                    <div className="space-y-6 animate-fade-in">
                      
                      {/* YouTube Video Tutorials Section */}
                      {(() => {
                        const phaseVideos = (selectedPhase.videos && selectedPhase.videos.length > 0) 
                          ? selectedPhase.videos 
                          : (selectedPhase.masterVideo ? [selectedPhase.masterVideo] : []);
                        
                        if (phaseVideos.length === 0) return null;

                        return (
                          <div className="space-y-6">
                            {phaseVideos.map((vid, vIdx) => (
                              <div key={vIdx} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-5 bg-gradient-to-b from-slate-50 dark:from-slate-900 via-white dark:via-slate-950 to-slate-50 dark:to-slate-950">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
                                      <Video className="w-6 h-6" />
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                                        Phase {selectedPhase.phaseNumber} • Video Tutorial {phaseVideos.length > 1 ? `#${vIdx + 1}` : ''}
                                      </span>
                                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mt-1">{vid.title}</h3>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
                                    {vid.duration && (
                                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-slate-700 dark:text-slate-300">
                                        ⏱️ {vid.duration}
                                      </span>
                                    )}
                                    {vid.channel && (
                                      <span className="px-2.5 py-1 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 rounded-lg text-brand-700 dark:text-brand-300 font-semibold">
                                        {vid.channel}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {vid.description && (
                                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{vid.description}</p>
                                )}

                                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl">
                                  <iframe
                                    src={vid.videoUrl}
                                    title={vid.title}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Student Video Recording Checklist */}
                      {selectedPhase.conceptVideos && (
                        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                            <Video className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                            <span>Student Recording Prompts & Video Checklist 📹</span>
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedPhase.conceptVideos.map((vid, idx) => {
                              const isExpanded = expandedVideoIdx === idx;
                              return (
                                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                                  <div
                                    onClick={() => setExpandedVideoIdx(isExpanded ? null : idx)}
                                    className="flex items-center justify-between cursor-pointer"
                                  >
                                    <h4 className="font-bold text-slate-900 dark:text-white text-xs hover:text-brand-600 dark:hover:text-brand-300 transition flex items-center space-x-2">
                                      <Video className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
                                      <span>{vid.title}</span>
                                    </h4>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                                  </div>

                                  {isExpanded && (
                                    <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 animate-fade-in">
                                      <p className="text-slate-600 dark:text-slate-400"><strong>What to cover:</strong> {vid.cover}</p>
                                      <span className="font-semibold text-brand-600 dark:text-brand-300 block">Ensure these are answered:</span>
                                      <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                                        {vid.questions.map((q, i) => (
                                          <li key={i}>{q}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Video Submission Requirements */}
                      {selectedPhase.videoSubmission && (
                        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                            <Video className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                            <span>Video Submission Format Guidelines 🎬</span>
                          </h3>
                          
                          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                            {selectedPhase.videoSubmission.map((item, idx) => (
                              <li key={idx} className="flex items-start space-x-2 p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>
                  )}

                  {/* TAB 4: RUBRICS & RESOURCES */}
                  {activeTab === 'rubrics' && (
                    <div className="space-y-6 animate-fade-in">
                      
                      {/* Evaluation Rubrics Matrix */}
                      {selectedPhase.rubrics && (
                        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4 overflow-x-auto">
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                              <ShieldCheck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                              <span>Phase {selectedPhase.phaseNumber} Facilitator Grading Rubric</span>
                            </h3>
                          </div>

                          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                            <thead>
                              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
                                <th className="p-3 font-bold">Parameter</th>
                                <th className="p-3 font-bold">Weight</th>
                                <th className="p-3 font-bold text-rose-600 dark:text-rose-400">Beginner</th>
                                <th className="p-3 font-bold text-amber-600 dark:text-amber-400">Intermediate</th>
                                <th className="p-3 font-bold text-brand-600 dark:text-brand-400">Advanced</th>
                                <th className="p-3 font-bold text-emerald-600 dark:text-emerald-400">Expert</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                              {selectedPhase.rubrics.map((r, idx) => (
                                <tr key={idx} className="hover:bg-slate-100 dark:hover:bg-slate-900/40 transition">
                                  <td className="p-3 font-bold text-slate-900 dark:text-white">{r.parameter}</td>
                                  <td className="p-3 font-mono text-brand-600 dark:text-brand-300 font-bold">{r.weight}</td>
                                  <td className="p-3 text-slate-600 dark:text-slate-400 leading-relaxed">{r.beginner}</td>
                                  <td className="p-3 text-slate-600 dark:text-slate-400 leading-relaxed">{r.intermediate}</td>
                                  <td className="p-3 text-slate-700 dark:text-slate-300 leading-relaxed">{r.advanced}</td>
                                  <td className="p-3 text-emerald-700 dark:text-emerald-300 font-medium leading-relaxed">{r.expert}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Essential Learning Resources */}
                      {selectedPhase.resources && (
                        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <span>Essential Learning Resources 📚</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedPhase.resources.map((res, idx) => (
                              <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900 dark:text-white text-xs">{res.name}</span>
                                  {res.url && (
                                    <a href={res.url} target="_blank" rel="noreferrer" className="text-brand-600 dark:text-brand-400 text-xs hover:underline flex items-center gap-1">
                                      Open Link <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400">{res.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* PHASE COMPLETION CHECKLIST & ACTION BANNER */}
                  {(() => {
                    const phaseReqs = getPhaseCompletionRequirements ? getPhaseCompletionRequirements(selectedPhase.phaseNumber) : { canComplete: true, totalMiniProjects: 0, submittedMiniProjectsCount: 0, allMiniProjectsSubmitted: true, quizPassed: true, bestScore: 0 };
                    const isCompleted = completedPhaseNumbers.includes(selectedPhase.phaseNumber);

                    return (
                      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-brand-200 dark:border-brand-800/60 bg-gradient-to-r from-slate-100 dark:from-slate-900 via-brand-500/10 dark:via-brand-950/40 to-slate-100 dark:to-slate-900 space-y-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                          <div className="space-y-1">
                            <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              <span>Phase {selectedPhase.phaseNumber} Deliverables & Completion Checklist</span>
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                              {isCompleted
                                ? `Phase ${selectedPhase.phaseNumber} is 100% completed and verified! The next phase is unlocked.`
                                : `All mini-projects (both Repo & Live links) and the phase assessment quiz must be submitted and passed before progressing.`}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                : phaseReqs.canComplete
                                ? 'bg-brand-500/20 text-brand-600 dark:text-brand-400 border-brand-500/30'
                                : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            }`}>
                              {isCompleted
                                ? 'Completed ✓'
                                : phaseReqs.canComplete
                                ? 'Ready to Complete 🎉'
                                : 'Deliverables Pending 🔒'}
                            </span>
                          </div>
                        </div>

                        {/* Checklist Grid */}
                        {!isCompleted && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Requirement 1: Mini Projects */}
                            <div className={`p-4 rounded-2xl border ${
                              phaseReqs.allMiniProjectsSubmitted
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-extrabold flex items-center space-x-1.5">
                                  <span>{phaseReqs.allMiniProjectsSubmitted ? '✓' : '⚠️'} 1. Mini Projects (GitHub + Live Links)</span>
                                </span>
                                <span className="text-[11px] font-mono font-bold">
                                  {phaseReqs.submittedMiniProjectsCount} / {phaseReqs.totalMiniProjects}
                                </span>
                              </div>
                              <p className="text-[11px] opacity-80">
                                {phaseReqs.allMiniProjectsSubmitted
                                  ? 'All mini project GitHub Repo & Live deployment links submitted!'
                                  : `Submit both Repo & Live URL for all ${phaseReqs.totalMiniProjects} mini projects in Mini Projects tab.`}
                              </p>
                            </div>

                            {/* Requirement 2: Assessment Quiz */}
                            <div className={`p-4 rounded-2xl border ${
                              phaseReqs.quizPassed
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-extrabold flex items-center space-x-1.5">
                                  <span>{phaseReqs.quizPassed ? '✓' : '⚠️'} 2. Phase Assessment Quiz (Score ≥ 80%)</span>
                                </span>
                                <span className="text-[11px] font-mono font-bold">
                                  {phaseReqs.quizPassed ? `${phaseReqs.bestScore}% ✓` : 'Not Passed'}
                                </span>
                              </div>
                              <p className="text-[11px] opacity-80">
                                {phaseReqs.quizPassed
                                  ? `Passed with ${phaseReqs.bestScore}% score!`
                                  : `Launch Phase ${selectedPhase.phaseNumber} Quiz in Assessment Hub and score at least 80%.`}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                          {!isCompleted && !phaseReqs.canComplete && (
                            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                              <Lock className="w-4 h-4 shrink-0" />
                              <span>Complete pending deliverables to unlock the Next Phase button.</span>
                            </p>
                          )}
                          
                          <button
                            onClick={() => {
                              if (isCompleted) {
                                const nextPhaseObj = curriculumPhases.find(p => p.phaseNumber > selectedPhase.phaseNumber);
                                if (nextPhaseObj) setSelectedPhase(nextPhaseObj);
                              } else {
                                const success = completePhase(selectedPhase.phaseNumber);
                                if (success) {
                                  const nextPhaseObj = curriculumPhases.find(p => p.phaseNumber > selectedPhase.phaseNumber);
                                  if (nextPhaseObj) setSelectedPhase(nextPhaseObj);
                                }
                              }
                            }}
                            disabled={!isCompleted && !phaseReqs.canComplete}
                            className={`px-6 py-3.5 rounded-2xl text-xs font-extrabold transition flex items-center space-x-2 shrink-0 shadow-lg ml-auto ${
                              isCompleted
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                                : phaseReqs.canComplete
                                ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/20 animate-pulse'
                                : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>
                              {isCompleted
                                ? `Completed! Go to Next Phase →`
                                : phaseReqs.canComplete
                                ? `Complete Phase ${selectedPhase.phaseNumber} & Unlock Next 🎉`
                                : `Complete All Deliverables to Unlock Next Phase 🔒`}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                </>
              )}

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { EmptyState } from '../components/common/EmptyState';
import { useLearning } from '../context/LearningContext';
import { 
  Brain, 
  Mic, 
  Search, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Calendar, 
  Sparkles,
  Target,
  MessageSquare,
  Award,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Zap,
  ArrowRight
} from 'lucide-react';

export function ReflectionsHub() {
  const navigate = useNavigate();
  const { 
    reflectionLogs, 
    deleteReflectionLog,
    sidebarCollapsed,
    simulatedLoading, 
    simulatedError, 
    simulatedEmpty, 
    setSimulatedError, 
    setSimulatedEmpty 
  } = useLearning();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [reflectionSearch, setReflectionSearch] = useState('');
  const [timeFilter, setTimeFilter] = useState('all'); // 'all' | 'today' | 'week'
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [speakingLogId, setSpeakingLogId] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Speech synthesis cleanup
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeakFeedback = (logId, text) => {
    if (!window.speechSynthesis) {
      alert('Text-to-speech audio playback is not supported on this browser.');
      return;
    }

    if (speakingLogId === logId) {
      window.speechSynthesis.cancel();
      setSpeakingLogId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingLogId(null);
    utterance.onerror = () => setSpeakingLogId(null);
    setSpeakingLogId(logId);
    window.speechSynthesis.speak(utterance);
  };

  const filteredReflections = reflectionLogs.filter(log => {
    // Time filter
    if (timeFilter === 'today' && log.date !== todayStr) return false;
    if (timeFilter === 'week') {
      const logDate = new Date(log.date);
      const now = new Date();
      const diffTime = Math.abs(now - logDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 7) return false;
    }

    // Search filter
    if (!reflectionSearch.trim()) return true;
    const term = reflectionSearch.toLowerCase();
    return (
      log.date.includes(term) ||
      log.studentReflection.toLowerCase().includes(term) ||
      log.aiFeedback.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className={`flex-1 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} transition-all duration-300 flex flex-col min-w-0`}>
        <TopHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6 max-w-6xl mx-auto w-full">


          {/* Premium Glassmorphic Hero Header Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl border border-indigo-800/40 space-y-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold tracking-wide uppercase">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>NVIDIA NIM AI Voice Mentor Hub</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Daily Voice Reflections & AI Feedback History
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  End-of-day voice reflections evaluated directly against your morning goals. Review AI concept corrections, listen to audio feedback, and answer deep mastery questions!
                </p>
              </div>

              {/* Action Button & Launch Session */}
              <button
                onClick={() => navigate('/reflections/live')}
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-indigo-500 hover:from-brand-400 hover:to-indigo-400 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-brand-500/30 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-3 shrink-0"
              >
                <div className="p-1.5 rounded-xl bg-white/20">
                  <Mic className="w-5 h-5 animate-pulse text-emerald-300" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] text-brand-200 uppercase font-mono tracking-wider">Interactive Voice Session</span>
                  <span className="text-sm font-extrabold">Start Voice Reflection 🎙️</span>
                </div>
                <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="relative z-10 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Total Sessions Logged</span>
                <span className="text-lg font-extrabold text-white font-mono">{reflectionLogs.length} Sessions</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Active AI Engine</span>
                <span className="text-xs font-bold text-emerald-300 font-mono truncate block">NVIDIA Nemotron 120B</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Goal Alignment</span>
                <span className="text-xs font-bold text-indigo-300 font-mono block">Evaluated Daily</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Conceptual Feedback</span>
                <span className="text-xs font-bold text-amber-300 font-mono block">Deep Corrections</span>
              </div>
            </div>

          </div>

          {/* State Conditional Display */}
          {simulatedLoading ? (
            <LoadingSpinner text="Loading reflection history..." />
          ) : simulatedError ? (
            <ErrorAlert 
              title="Failed to load reflections"
              message="Simulated error flag is active. Click below to clear error state."
              onRetry={() => setSimulatedError(false)}
            />
          ) : simulatedEmpty ? (
            <EmptyState 
              title="No Reflections Recorded"
              description="Start your first voice reflection to log feedback!"
              actionText="Reset Reflections Hub"
              onAction={() => setSimulatedEmpty(false)}
            />
          ) : (
            <div className="space-y-6 animate-fade-in">

              {/* Filter Bar & Search Control */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Segmented Filter Pills */}
                  <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {[
                      { id: 'all', label: 'All History', count: reflectionLogs.length },
                      { id: 'today', label: "Today's Logs", count: reflectionLogs.filter(l => l.date === todayStr).length },
                      { id: 'week', label: 'Past 7 Days', count: reflectionLogs.length }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setTimeFilter(f.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                          timeFilter === f.id
                            ? 'bg-brand-600 text-white shadow-md'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span>{f.label}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${timeFilter === f.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>
                          {f.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={reflectionSearch}
                      onChange={(e) => setReflectionSearch(e.target.value)}
                      placeholder="Search by date, concepts (HTML, JS, React), or AI feedback..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-brand-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Saved Reflection Log Cards */}
              <div className="space-y-6">
                {filteredReflections.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center space-y-3 border border-slate-200 dark:border-slate-800">
                    <Brain className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      No reflection logs found for your search/filter criteria.
                    </p>
                    <button
                      onClick={() => navigate('/reflections/live')}
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold inline-flex items-center space-x-2 transition"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start Today's Reflection Now 🎙️</span>
                    </button>
                  </div>
                ) : (
                  filteredReflections.map((log) => {
                    const isExpanded = expandedLogId === log.id;
                    const isSpeakingThisLog = speakingLogId === log.id;

                    return (
                      <div
                        key={log.id}
                        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm transition hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
                      >
                        {/* Card Header Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                            <span className="text-xs font-mono font-extrabold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center space-x-1.5">
                              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Date: {log.date}</span>
                            </span>
                            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </span>
                            {log.modelUsed && (
                              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                Model: {log.modelUsed}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            
                            {/* Audio Playback Button */}
                            <button
                              onClick={() => handleSpeakFeedback(log.id, log.aiFeedback)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition flex items-center space-x-1.5 ${
                                isSpeakingThisLog
                                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md animate-pulse'
                                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                              }`}
                              title="Listen to AI Feedback Aloud"
                            >
                              {isSpeakingThisLog ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
                              <span>{isSpeakingThisLog ? 'Pause Audio ⏸️' : 'Listen AI Audio 🔊'}</span>
                            </button>

                            {/* Details Toggle */}
                            <button
                              onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center space-x-1"
                            >
                              <span>{isExpanded ? 'Collapse' : 'Full Details'}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                            {/* Delete Log */}
                            <button
                              onClick={() => deleteReflectionLog(log.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 transition rounded-xl hover:bg-rose-50 dark:hover:bg-slate-800"
                              title="Delete reflection log"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Student Voice Output Transcript Box */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <span className="flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400">
                              <Mic className="w-4 h-4" />
                              <span>Student Voice / Text Reflection Input</span>
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">Recorded Audio Transcript</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            "{log.studentReflection}"
                          </p>
                        </div>

                        {/* Morning Goals Snapshot evaluated */}
                        {log.goalsSnapshot && log.goalsSnapshot.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block flex items-center space-x-1.5">
                              <Target className="w-3.5 h-3.5 text-brand-500" />
                              <span>Morning Goals Evaluated in Session ({log.goalsSnapshot.length}):</span>
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                              {log.goalsSnapshot.map((g, idx) => (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                                    g.completed || g.progress === 100
                                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80'
                                      : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80'
                                  }`}
                                >
                                  <div className="flex items-center justify-between font-bold">
                                    <span className="truncate text-slate-900 dark:text-white">{g.title}</span>
                                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                      g.completed ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200' : 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200'
                                    }`}>
                                      {g.completed ? '100%' : `${g.progress}%`}
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${g.completed ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                      style={{ width: `${g.progress}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* NVIDIA AI Mentor Feedback Box */}
                        {(isExpanded || filteredReflections.length <= 2) && (
                          <div className="p-5 sm:p-6 bg-gradient-to-br from-indigo-50/80 dark:from-indigo-950/50 via-slate-50 dark:via-slate-900 to-indigo-50/30 dark:to-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 space-y-3 animate-fade-in shadow-xs">
                            <div className="flex items-center justify-between border-b border-indigo-200/60 dark:border-indigo-800/60 pb-3">
                              <div className="flex items-center space-x-2">
                                <Cpu className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                                  NVIDIA AI Mentor Evaluation & Conceptual Feedback
                                </h4>
                              </div>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200">
                                NVIDIA NIM Output
                              </span>
                            </div>

                            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                              {log.aiFeedback}
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

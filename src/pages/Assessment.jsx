import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { EmptyState } from '../components/common/EmptyState';
import { useLearning } from '../context/LearningContext';
import { curriculumPhases as initialCurriculumPhases } from '../data/curriculumPhases';
import { fetchGeminiPhaseQuiz, generateGeminiFallbackPhaseQuiz } from '../services/geminiQuizService';
import { ToastContainer } from '../components/common/ToastNotification';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Lock, 
  Sparkles, 
  Layers, 
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Zap,
  X,
  Maximize2,
  Check,
  Brain,
  ShieldCheck,
  BarChart3,
  Bot,
  RefreshCw,
  Play,
  History
} from 'lucide-react';

export function Assessment() {
  const { 
    curriculumPhases: contextCurriculumPhases,
    getActivePhaseNumber,
    getActivePhaseDetails,
    completedPhaseNumbers,
    completePhase,
    isPhaseUnlocked,
    assessmentAttempts,
    recordAssessmentAttempt,
    getAssessmentAttemptsForPhase,
    getAttemptCountForPhase,
    getBestScoreForPhase,
    getLastAttemptForPhase,
    askedQuestionIds,
    recordAskedQuestions,
    sidebarCollapsed,
    simulatedLoading, 
    simulatedError, 
    simulatedEmpty, 
    setSimulatedError, 
    setSimulatedEmpty 
  } = useLearning();

  const curriculumPhases = (contextCurriculumPhases && contextCurriculumPhases.length > 0) ? contextCurriculumPhases : initialCurriculumPhases;

  const [mobileOpen, setMobileOpen] = useState(false);
  const activePhaseNum = getActivePhaseNumber();
  const activePhaseDetails = getActivePhaseDetails();

  const [selectedPhaseNum, setSelectedPhaseNum] = useState(activePhaseNum);
  const [aiGeneratedQuizzes, setAiGeneratedQuizzes] = useState({});
  const [isGeneratingAIQuiz, setIsGeneratingAIQuiz] = useState(false);
  const [launchingPhaseNum, setLaunchingPhaseNum] = useState(null);

  // Floating Popup Toast Notifications State
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const newToast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      duration: 4500,
      ...toast
    };
    setToasts(prev => [newToast, ...prev].slice(0, 4));
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auto-sync selected phase when active phase changes
  useEffect(() => {
    setSelectedPhaseNum(activePhaseNum);
  }, [activePhaseNum]);

  // Dynamic NVIDIA AI Quiz Generation Effect per Selected Phase
  useEffect(() => {
    let isMounted = true;

    async function loadAIQuiz() {
      if (aiGeneratedQuizzes[selectedPhaseNum]) return;

      const phaseObj = curriculumPhases.find(p => p.phaseNumber === selectedPhaseNum || Math.floor(p.phaseNumber) === Math.floor(selectedPhaseNum)) || curriculumPhases[0];
      const topics = phaseObj.topicMatrix?.map(t => t.topic) || [phaseObj.title];

      const res = await fetchGeminiPhaseQuiz({
        phaseNumber: selectedPhaseNum,
        phaseTitle: phaseObj.title,
        phaseTopics: topics,
        askedQuestionIds
      });

      if (isMounted && res.quiz) {
        if (Array.isArray(res.quiz.questions)) {
          recordAskedQuestions(res.quiz.questions.map(q => q.question || q.id));
        }
        setAiGeneratedQuizzes(prev => ({
          ...prev,
          [selectedPhaseNum]: res.quiz
        }));
      }
    }

    loadAIQuiz();

    return () => {
      isMounted = false;
    };
  }, [selectedPhaseNum, aiGeneratedQuizzes, askedQuestionIds]);

  // Selected Quiz object (Google Gemini AI generated or phase-specific fallback)
  const selectedPhaseObj = curriculumPhases.find(p => p.phaseNumber === selectedPhaseNum || Math.floor(p.phaseNumber) === Math.floor(selectedPhaseNum)) || curriculumPhases[0];
  const defaultFallbackQuiz = generateGeminiFallbackPhaseQuiz(selectedPhaseNum, selectedPhaseObj?.title || `Phase ${selectedPhaseNum}`, askedQuestionIds);
  const candidateQuiz = aiGeneratedQuizzes[selectedPhaseNum];
  const selectedQuiz = (candidateQuiz && Array.isArray(candidateQuiz.questions) && candidateQuiz.questions.length > 0)
    ? candidateQuiz
    : defaultFallbackQuiz;
  const activeQuestions = (selectedQuiz && Array.isArray(selectedQuiz.questions) && selectedQuiz.questions.length > 0)
    ? selectedQuiz.questions
    : defaultFallbackQuiz.questions;

  const handleRegenerateAIQuiz = async (phaseNum) => {
    const targetNum = phaseNum || selectedPhaseNum;
    setIsGeneratingAIQuiz(true);
    setLaunchingPhaseNum(targetNum);

    addToast({
      type: 'ai',
      title: 'Google Gemini AI 🤖',
      message: `Generating fresh Phase ${targetNum} questions via Google Gemini AI...`
    });

    const phaseObj = curriculumPhases.find(p => p.phaseNumber === targetNum || Math.floor(p.phaseNumber) === Math.floor(targetNum)) || curriculumPhases[0];
    const topics = phaseObj.topicMatrix?.map(t => t.topic) || [phaseObj.title];

    const res = await fetchGeminiPhaseQuiz({
      phaseNumber: targetNum,
      phaseTitle: phaseObj.title,
      phaseTopics: topics,
      askedQuestionIds
    });

    if (res.quiz) {
      if (Array.isArray(res.quiz.questions)) {
        recordAskedQuestions(res.quiz.questions.map(q => q.question || q.id));
      }
      setAiGeneratedQuizzes(prev => ({
        ...prev,
        [targetNum]: res.quiz
      }));
      addToast({
        type: 'success',
        title: 'Refreshed! ✨',
        message: `Refreshed Phase ${targetNum} assessment questions.`
      });
    }
    setIsGeneratingAIQuiz(false);
    setLaunchingPhaseNum(null);
  };

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState((selectedQuiz?.timeLimitMinutes || 15) * 60);
  const [attemptRecorded, setAttemptRecorded] = useState(false);

  useEffect(() => {
    if (!quizStarted) {
      setQuizSubmitted(false);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setTimeLeft((selectedQuiz?.timeLimitMinutes || 15) * 60);
      setAttemptRecorded(false);
    }
  }, [selectedPhaseNum]);

  // Record assessment attempt upon submission
  useEffect(() => {
    if (quizSubmitted && !attemptRecorded && selectedQuiz) {
      const totalQuestions = selectedQuiz.questions?.length || 10;
      let correctCount = 0;
      if (selectedQuiz.questions) {
        selectedQuiz.questions.forEach((q) => {
          if (selectedAnswers[q.id] === q.correctIndex) {
            correctCount++;
          }
        });
      }
      const scoreVal = Math.round((correctCount / totalQuestions) * 100);
      const passThreshold = selectedQuiz.passingScore || 80;
      const isPassed = scoreVal >= passThreshold;

      recordAssessmentAttempt({
        phaseNumber: selectedQuiz.phaseNumber,
        phaseTitle: selectedQuiz.title,
        score: scoreVal,
        passingScore: passThreshold,
        passed: isPassed,
        correctCount,
        totalQuestions
      });

      setAttemptRecorded(true);

      if (isPassed) {
        addToast({
          type: 'award',
          title: 'Assessment Passed! 🎉',
          message: `Score: ${scoreVal}%! Phase ${selectedQuiz.phaseNumber} completed & next phase unlocked!`
        });
      } else {
        addToast({
          type: 'warning',
          title: `Score: ${scoreVal}% (Passing: ${passThreshold}%)`,
          message: `Review topics & click Retake Assessment to generate 10 fresh questions!`
        });
      }
    }
  }, [quizSubmitted, attemptRecorded, selectedQuiz, selectedAnswers, recordAssessmentAttempt]);

  // Timer Countdown Effect
  useEffect(() => {
    let timer;
    if (quizStarted && !quizSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStarted && !quizSubmitted) {
      setQuizSubmitted(true);
    }
    return () => clearInterval(timer);
  }, [quizStarted, quizSubmitted, timeLeft]);

  const handleSelectOption = (questionId, optionIndex) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    if (!selectedQuiz || !selectedQuiz.questions) return 0;
    let correct = 0;
    selectedQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return Math.round((correct / selectedQuiz.questions.length) * 100);
  };

  const handleRestart = async (phaseNum) => {
    const targetNum = phaseNum || selectedPhaseNum;
    setSelectedPhaseNum(targetNum);
    setLaunchingPhaseNum(targetNum);
    setQuizStarted(false);
    setQuizSubmitted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setAttemptRecorded(false);
    setIsGeneratingAIQuiz(true);

    addToast({
      type: 'ai',
      title: 'Retaking Assessment 🔄',
      message: `Requesting 10 brand-new questions from Google Gemini AI...`
    });

    const phaseObj = curriculumPhases.find(p => p.phaseNumber === targetNum || Math.floor(p.phaseNumber) === Math.floor(targetNum)) || curriculumPhases[0];
    const topics = phaseObj.topicMatrix?.map(t => t.topic) || [phaseObj.title];

    let quizToUse = null;
    try {
      const res = await fetchGeminiPhaseQuiz({
        phaseNumber: targetNum,
        phaseTitle: phaseObj.title,
        phaseTopics: topics,
        askedQuestionIds
      });
      if (res && res.quiz) {
        quizToUse = res.quiz;
      }
    } catch (err) {
      console.warn("Gemini AI quiz restart generation error:", err);
    }

    if (!quizToUse) {
      quizToUse = generateGeminiFallbackPhaseQuiz(targetNum, phaseObj.title, askedQuestionIds);
    }

    if (quizToUse && Array.isArray(quizToUse.questions)) {
      recordAskedQuestions(quizToUse.questions.map(q => q.question || q.id));
    }

    setAiGeneratedQuizzes(prev => ({
      ...prev,
      [targetNum]: quizToUse
    }));
    setTimeLeft((quizToUse.timeLimitMinutes || 15) * 60);
    setIsGeneratingAIQuiz(false);
    setLaunchingPhaseNum(null);
    setQuizStarted(true);

    addToast({
      type: 'success',
      title: 'Fresh Quiz Ready ⚡',
      message: `10 brand-new questions generated for Phase ${targetNum} retake!`
    });
  };

  const handleCloseModal = () => {
    if (quizStarted && !quizSubmitted) {
      if (window.confirm("Are you sure you want to exit the live assessment? Your current progress will be lost.")) {
        setQuizStarted(false);
        setQuizSubmitted(false);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
      }
    } else {
      setQuizStarted(false);
      setQuizSubmitted(false);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const score = quizSubmitted ? calculateScore() : 0;

  // Auto-complete phase when student passes quiz
  useEffect(() => {
    if (quizSubmitted && score >= (selectedQuiz?.passingScore || 80)) {
      if (completePhase && selectedQuiz?.phaseNumber) {
        completePhase(selectedQuiz.phaseNumber);
      }
    }
  }, [quizSubmitted, score, selectedQuiz, completePhase]);

  const startAssessmentForPhase = async (phaseNum) => {
    const targetNum = phaseNum || selectedPhaseNum;
    setSelectedPhaseNum(targetNum);
    setLaunchingPhaseNum(targetNum);
    setQuizSubmitted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setAttemptRecorded(false);
    setIsGeneratingAIQuiz(true);

    addToast({
      type: 'ai',
      title: 'Google Gemini AI 🤖',
      message: `Generating 10 brand-new Phase ${targetNum} assessment questions...`
    });

    const phaseObj = curriculumPhases.find(p => p.phaseNumber === targetNum || Math.floor(p.phaseNumber) === Math.floor(targetNum)) || curriculumPhases[0];
    const topics = phaseObj.topicMatrix?.map(t => t.topic) || [phaseObj.title];

    let quizToUse = null;
    try {
      const res = await fetchGeminiPhaseQuiz({
        phaseNumber: targetNum,
        phaseTitle: phaseObj.title,
        phaseTopics: topics,
        askedQuestionIds
      });
      if (res && res.quiz) {
        quizToUse = res.quiz;
      }
    } catch (err) {
      console.warn("Gemini AI quiz fetch error:", err);
    }

    if (!quizToUse) {
      quizToUse = generateGeminiFallbackPhaseQuiz(targetNum, phaseObj.title, askedQuestionIds);
    }

    if (quizToUse && Array.isArray(quizToUse.questions)) {
      recordAskedQuestions(quizToUse.questions.map(q => q.question || q.id));
    }

    setAiGeneratedQuizzes(prev => ({
      ...prev,
      [targetNum]: quizToUse
    }));
    setTimeLeft((quizToUse.timeLimitMinutes || 15) * 60);
    setIsGeneratingAIQuiz(false);
    setLaunchingPhaseNum(null);
    setQuizStarted(true);

    addToast({
      type: 'success',
      title: 'Quiz Ready ✨',
      message: `10 unique non-repetitive questions generated by Google Gemini AI!`
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors selection:bg-brand-500 selection:text-white">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className={`flex-1 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} transition-all duration-300 flex flex-col min-w-0`}>
        <TopHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-8 max-w-7xl mx-auto w-full animate-fade-in">

          {/* User-Friendly Hero Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/30">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-400/30 flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                    <span>Proctored Diagnostic Center</span>
                  </span>
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span>Active Phase: Phase {activePhaseNum}</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                  <Award className="w-8 h-8 text-amber-400 shrink-0" />
                  <span>Phase Diagnostic Assessments</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Test your mastery across all 7 curriculum phases with 10-question quizzes powered by Google Gemini AI. Score 80%+ to auto-unlock next phase credentials!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button
                  onClick={() => startAssessmentForPhase(activePhaseNum)}
                  disabled={launchingPhaseNum !== null}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 disabled:opacity-70 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5 border border-brand-400/30"
                >
                  {launchingPhaseNum === activePhaseNum ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                      <span>Generating Phase {activePhaseNum} Quiz... ⚡</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Launch Phase {activePhaseNum} Quiz 🚀</span>
                    </>
                  )}
                </button>

                <Link
                  to="/curriculum"
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center space-x-2 shrink-0 shadow-lg"
                >
                  <Layers className="w-4 h-4 text-brand-400" />
                  <span>Curriculum Hub</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Conditional Loading / Error State Display */}
          {simulatedLoading ? (
            <LoadingSpinner text="Loading phase diagnostic assessments..." />
          ) : simulatedError ? (
            <ErrorAlert 
              title="Assessment Engine Error"
              message="Simulated error flag active. Click below to reset."
              onRetry={() => setSimulatedError(false)}
            />
          ) : simulatedEmpty ? (
            <EmptyState 
              title="No Quizzes Found"
              description="Reset simulator to load active phase assessments."
              actionText="Reset Quiz Center"
              onAction={() => setSimulatedEmpty(false)}
            />
          ) : (
            <div className="space-y-6">
              
              {/* Header Title for 7 Phase Diagnostic Catalog */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  <span>Full-Stack 7 Phases Diagnostic Catalog</span>
                </h2>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  7 Diagnostic Modules Available
                </span>
              </div>

              {/* CLEAN 7-PHASE DIAGNOSTIC CATALOG GRID CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {curriculumPhases.map((phaseItem) => {
                  const quiz = generateGeminiFallbackPhaseQuiz(phaseItem.phaseNumber, phaseItem.title, askedQuestionIds);
                  const unlocked = isPhaseUnlocked(quiz.phaseNumber);
                  const isCurrentActive = Math.floor(quiz.phaseNumber) === activePhaseNum;
                  const isCompleted = completedPhaseNumbers.includes(quiz.phaseNumber);
                  const attemptCount = getAttemptCountForPhase(quiz.phaseNumber);
                  const bestScore = getBestScoreForPhase(quiz.phaseNumber);

                  return (
                    <div
                      key={quiz.id}
                      className={`glass-card rounded-3xl p-6 border transition flex flex-col justify-between space-y-5 relative overflow-hidden ${
                        isCurrentActive
                          ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                          : isCompleted
                          ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/10'
                          : unlocked
                          ? 'border-slate-200 dark:border-slate-800 hover:border-brand-500/50'
                          : 'opacity-60 bg-slate-100/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-900'
                      }`}
                    >
                      <div className="space-y-3">
                        
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full font-mono uppercase tracking-wider ${
                            isCompleted
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : isCurrentActive
                              ? 'bg-brand-600 text-white shadow-sm'
                              : unlocked
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          }`}>
                            Phase {quiz.phaseNumber}
                          </span>

                          <div className="flex items-center space-x-1">
                            {isCompleted ? (
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Passed ✓</span>
                              </span>
                            ) : isCurrentActive ? (
                              <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
                                <span>Current Active</span>
                              </span>
                            ) : unlocked ? (
                              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                Unlocked
                              </span>
                            ) : (
                              <Lock className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {quiz.category}
                          </span>
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                            {quiz.title}
                          </h3>
                        </div>

                        {/* Specs Pill Grid */}
                        <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                            <span className="text-slate-400 text-[10px] block">Questions</span>
                            <strong className="text-slate-800 dark:text-slate-200">{quiz.questions?.length || 10} Qs</strong>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                            <span className="text-slate-400 text-[10px] block">Duration</span>
                            <strong className="text-slate-800 dark:text-slate-200">{quiz.timeLimitMinutes}m</strong>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                            <span className="text-slate-400 text-[10px] block">Pass Score</span>
                            <strong className="text-emerald-600 dark:text-emerald-400">{quiz.passingScore}%</strong>
                          </div>
                        </div>

                        {/* Student Phase Attempt & Best Score Pill Banner */}
                        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-[11px] font-mono">
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                            <History className="w-3.5 h-3.5 text-brand-500" />
                            <span>Attempts: <strong className="text-slate-900 dark:text-white font-bold">{attemptCount}</strong></span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            <span>Best: <strong className={bestScore !== null ? (bestScore >= (quiz.passingScore || 80) ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-amber-600 dark:text-amber-400 font-bold") : "text-slate-400 font-normal"}>
                              {bestScore !== null ? `${bestScore}%` : 'N/A'}
                            </strong></span>
                          </div>
                        </div>

                      </div>

                      {/* Action Button */}
                      <div>
                        {unlocked ? (
                          <button
                            onClick={() => startAssessmentForPhase(quiz.phaseNumber)}
                            disabled={launchingPhaseNum !== null}
                            className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 disabled:opacity-70 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 transition flex items-center justify-center space-x-2"
                          >
                            {launchingPhaseNum === quiz.phaseNumber ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" />
                                <span>Generating Quiz... ⚡</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-white" />
                                <span>Launch Proctored Quiz 🚀</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500 font-bold text-xs cursor-not-allowed flex items-center justify-center space-x-1.5"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                            <span>Locked — Complete Phase {Math.floor(quiz.phaseNumber) - 1} First</span>
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* STUDENT ASSESSMENT ATTEMPT HISTORY LOG TABLE / CARD */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                      <History className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                      <span>Student Assessment Attempt History Log</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Complete audit trail of all quiz submissions, scores, and pass status per curriculum phase.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20">
                      Total Recorded Attempts: {assessmentAttempts.length}
                    </span>
                  </div>
                </div>

                {assessmentAttempts.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                      <History className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Assessment Attempts Yet</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      Launch any phase diagnostic quiz above to start building your assessment attempt record!
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                          <th className="py-3 px-4 font-bold">Phase</th>
                          <th className="py-3 px-4 font-bold">Assessment Module</th>
                          <th className="py-3 px-4 font-bold">Score</th>
                          <th className="py-3 px-4 font-bold">Status</th>
                          <th className="py-3 px-4 font-bold">Correct Qs</th>
                          <th className="py-3 px-4 font-bold text-right">Attempt Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                        {assessmentAttempts.map((attempt) => (
                          <tr key={attempt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                Phase {attempt.phaseNumber}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                              {attempt.phaseTitle}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-black text-sm">
                              <span className={attempt.passed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                                {attempt.score}%
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {attempt.passed ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>PASSED</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                                  <span>FAILED</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                              {attempt.correctCount} / {attempt.totalQuestions}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 text-right">
                              {attempt.date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ULTRA-CLEAN FULL-SCREEN PROCTORING ENVIRONMENT FOR QUIZ EXECUTION */}
      {quizStarted && (
        <div 
          onCopy={(e) => { e.preventDefault(); alert("⚠️ Copying question text is disabled during live assessment."); }}
          onPaste={(e) => { e.preventDefault(); alert("⚠️ Pasting external text is disabled during live assessment."); }}
          onCut={(e) => { e.preventDefault(); }}
          onContextMenu={(e) => { e.preventDefault(); }}
          className="fixed inset-0 z-50 w-screen h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden animate-fade-in select-none"
        >
          {/* Top Sticky Header */}
          <header className="px-6 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 gap-4 shadow-sm z-20">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                    Phase {selectedQuiz.phaseNumber} Proctored Assessment
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5 text-purple-500" />
                    <span>Google Gemini AI</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Question Jump Palette Buttons */}
            {!quizSubmitted && (
              <div className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                {selectedQuiz.questions.map((qItem, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isAnswered = selectedAnswers[qItem.id] !== undefined;

                  return (
                    <button
                      key={qItem.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-7 h-7 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center ${
                        isCurrent
                          ? 'bg-brand-600 text-white shadow-md ring-2 ring-brand-400'
                          : isAnswered
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      title={`Jump to Q${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-center space-x-3">
              {/* Timer Pill */}
              <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl font-mono text-xs font-black border transition ${
                timeLeft < 180 
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-600 dark:text-rose-300 animate-pulse' 
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
              }`}>
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              {/* Exit Button */}
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 transition"
                title="Exit Assessment"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Progress Bar Line */}
          {!quizSubmitted && (
            <div className="w-full bg-slate-200 dark:bg-slate-900 h-1.5 overflow-hidden shrink-0">
              <div 
                className="bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 h-full transition-all duration-300 shadow-xs"
                style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
              />
            </div>
          )}

          {/* Main Viewport Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
            
            {quizSubmitted ? (
              /* RESULTS / SCORECARD BREAKDOWN SCREEN */
              <div className="space-y-6 animate-fade-in max-w-3xl mx-auto w-full py-6">
                
                {/* Score Summary Card */}
                <div className="text-center space-y-4 bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
                  
                  <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center mx-auto border-4 shadow-xl transform transition-all ${
                    score >= selectedQuiz.passingScore 
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-emerald-500/20' 
                      : 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-700 dark:text-rose-300 shadow-rose-500/20'
                  }`}>
                    <span className="text-3xl font-black">{score}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Score</span>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      {score >= selectedQuiz.passingScore ? `Phase ${selectedQuiz.phaseNumber} Passed! 🎉` : `Phase ${selectedQuiz.phaseNumber} Needs Review`}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                      {score >= selectedQuiz.passingScore 
                        ? `Fantastic achievement! You answered ${Math.round((score / 100) * selectedQuiz.questions.length)} out of ${selectedQuiz.questions.length} questions correctly.` 
                        : `You answered ${Math.round((score / 100) * selectedQuiz.questions.length)} of ${selectedQuiz.questions.length} correctly. Review the AI concept breakdowns below and retake when ready.`}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleRestart}
                      className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold inline-flex items-center space-x-2 transition shadow-sm border border-slate-200 dark:border-slate-700"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake Assessment ({selectedQuiz.questions.length} Qs)</span>
                    </button>

                    <button
                      onClick={handleCloseModal}
                      className="px-7 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-extrabold inline-flex items-center space-x-2 transition shadow-lg shadow-brand-500/20"
                    >
                      <Check className="w-4 h-4" />
                      <span>Complete & Return</span>
                    </button>
                  </div>
                </div>

                {/* Answer Breakdown & Explanations */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                      <span>Detailed Answer Review ({selectedQuiz.questions.length} Qs)</span>
                    </h3>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Passing Threshold: {selectedQuiz.passingScore}%</span>
                  </div>
                  
                  {selectedQuiz.questions.map((q, idx) => {
                    const userAns = selectedAnswers[q.id];
                    const isCorrect = userAns === q.correctIndex;

                    return (
                      <div key={q.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                            Q{idx + 1}. {q.question}
                          </h4>
                          {isCorrect ? (
                            <span className="flex items-center space-x-1.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span>Correct</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-1.5 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800 shrink-0 font-bold">
                              <XCircle className="w-4 h-4 text-rose-500" />
                              <span>Incorrect</span>
                            </span>
                          )}
                        </div>

                        {/* Options grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = userAns === optIdx;
                            const isRight = q.correctIndex === optIdx;

                            let bgClass = "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300";
                            if (isRight) bgClass = "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold";
                            else if (isSelected && !isRight) bgClass = "bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-800 dark:text-rose-200 font-medium";

                            return (
                              <div key={optIdx} className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between ${bgClass}`}>
                                <div className="flex items-center space-x-2.5">
                                  <span className="w-6 h-6 rounded-xl border flex items-center justify-center text-[10px] font-mono shrink-0 font-bold bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span>{opt}</span>
                                </div>
                                {isRight && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                                {isSelected && !isRight && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* AI Concept Explanation Box */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                          <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5 text-xs">
                            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                            <span>AI Concept Explanation:</span>
                          </span>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs pl-5">{q.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* CLEAN CENTERED EXAM QUESTION CARD RUNNER */
              <div className="max-w-3xl mx-auto w-full py-6 space-y-6">
                
                {/* Active Question Box */}
                {(() => {
                  const q = activeQuestions[currentQuestionIndex] || activeQuestions[0];
                  if (!q) return null;
                  return (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl">
                      
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
                        <span className="text-xs font-mono font-extrabold px-3.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300 border border-brand-500/20 uppercase tracking-wider">
                          Question {currentQuestionIndex + 1} of {activeQuestions.length}
                        </span>

                        <span className="text-xs font-mono font-bold">
                          {selectedAnswers[q.id] !== undefined ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Option Selected ✓
                            </span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400 font-medium">Select an option below to proceed</span>
                          )}
                        </span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-relaxed">
                        {q.question}
                      </h2>

                      {/* Spacious Option Cards List */}
                      <div className="space-y-3 pt-2">
                        {q.options.map((optionText, optIdx) => {
                          const isSelected = selectedAnswers[q.id] === optIdx;
                          return (
                            <div
                              key={optIdx}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer text-xs sm:text-sm font-semibold transition-all transform hover:-translate-y-0.5 flex items-center justify-between ${
                                isSelected
                                  ? 'bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 border-brand-400 text-white shadow-xl font-bold ring-2 ring-brand-500/30'
                                  : 'bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-brand-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                              }`}
                            >
                              <div className="flex items-center space-x-3.5">
                                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-mono font-extrabold shrink-0 transition ${
                                  isSelected 
                                    ? 'bg-white text-slate-900 border-white shadow-sm' 
                                    : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </div>
                                <span className="pr-2 leading-snug">{optionText}</span>
                              </div>

                              <div className="shrink-0 pl-2">
                                {isSelected ? (
                                  <CheckCircle2 className="w-5 h-5 text-white" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

              </div>
            )}

          </main>

          {/* Bottom Navigation Footer */}
          {!quizSubmitted && (
            <footer className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 shadow-2xl z-20">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 hidden sm:block">
                Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length} • Answered {Object.keys(selectedAnswers).length} of {selectedQuiz.questions.length}
              </div>

              {(() => {
                const currentQ = selectedQuiz.questions[currentQuestionIndex];
                const isCurrentQAnswered = selectedAnswers[currentQ?.id] !== undefined;

                return currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
                  <button
                    onClick={() => {
                      if (isCurrentQAnswered) {
                        setCurrentQuestionIndex(prev => prev + 1);
                      }
                    }}
                    disabled={!isCurrentQAnswered}
                    className={`px-6 py-2.5 text-xs font-extrabold rounded-2xl shadow-lg transition flex items-center gap-1.5 ${
                      isCurrentQAnswered 
                        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white cursor-pointer shadow-brand-500/20' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60 border border-slate-300 dark:border-slate-700'
                    }`}
                    title={!isCurrentQAnswered ? "Please select an option before moving to the next question." : "Next Question"}
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (isCurrentQAnswered) {
                        setQuizSubmitted(true);
                      }
                    }}
                    disabled={!isCurrentQAnswered}
                    className={`px-7 py-2.5 text-xs font-black rounded-2xl shadow-xl transition flex items-center gap-2 ${
                      isCurrentQAnswered 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white cursor-pointer shadow-emerald-500/25' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60 border border-slate-300 dark:border-slate-700'
                    }`}
                    title={!isCurrentQAnswered ? "Please select an option before submitting the assessment." : "Submit Assessment"}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Phase {selectedQuiz.phaseNumber} Assessment ({selectedQuiz.questions.length} Qs)</span>
                  </button>
                );
              })()}
            </footer>
          )}

        </div>
      )}

      {/* Floating Popup Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

    </div>
  );
}

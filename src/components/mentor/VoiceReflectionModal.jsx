import React, { useState, useEffect, useRef } from 'react';
import { useLearning } from '../../context/LearningContext';
import { getNVidiaVoiceReflection } from '../../services/nvidiaVoiceMentorService';
import { playHumanVoice, stopHumanVoice } from '../../services/humanVoiceService';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Target, 
  HelpCircle, 
  X, 
  Brain, 
  Cpu, 
  RefreshCw,
  MessageSquare,
  ArrowRight,
  Clock,
  Award
} from 'lucide-react';

export function VoiceReflectionModal({ isOpen, onClose }) {
  const { dailyGoals, saveDailyReflection, forwardIncompleteDailyGoals } = useLearning();

  // Get today's morning goals
  const todayStr = new Date().toISOString().split('T')[0];
  const todayGoals = dailyGoals ? dailyGoals.filter(g => g.date === todayStr) : [];

  // Track forwarded tasks
  const [forwardedGoalsList, setForwardedGoalsList] = useState([]);

  useEffect(() => {
    if (dailyGoals) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const toDate = tomorrow.toISOString().split('T')[0];
      const existing = dailyGoals.filter(g => g.rolledOverFrom === todayStr || (g.date === toDate && g.forwardedFromReflection));
      if (existing.length > 0) {
        setForwardedGoalsList(existing);
      }
    }
  }, [dailyGoals, todayStr]);

  const initialAiGreeting = todayGoals.length > 0
    ? `Hello! I am your AI Voice Mentor. Here are the daily goals you set earlier today:\n${todayGoals.map((g, i) => `${i + 1}. ${g.title} (${g.completed ? '100% Completed' : `${g.progress || 0}% Done`})`).join('\n')}\n\nPlease share your complete day's reflection all at once—what you finished, new technical concepts learned, and what remained unfinished. Once received, any unfinished goals will be automatically forwarded to tomorrow, and we will begin our comprehensive 30-minute deep-dive dialogue. I will systematically cross-question you across all your topics until complete conceptual mastery is verified!`
    : `Hello! I am your AI Voice Mentor. Please share your complete day's reflection all at once—what programming concepts, algorithms, or projects did you learn or practice today, and any challenges you faced! We will then begin our comprehensive 30-minute deep-dive dialogue, cross-questioning you across all your topics until complete conceptual mastery is verified.`;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [sessionSecondsElapsed, setSessionSecondsElapsed] = useState(0);
  const [isSessionConcluded, setIsSessionConcluded] = useState(false);

  // 30-Minute Session Duration Timer
  useEffect(() => {
    if (!isOpen || isSessionConcluded) return;
    const interval = setInterval(() => {
      setSessionSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isSessionConcluded]);

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: initialAiGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [silenceSecondsLeft, setSilenceSecondsLeft] = useState(60);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const shouldListenRef = useRef(false);
  const accumulatedTranscriptRef = useRef('');
  const silenceTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const clearSilenceTimers = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setSilenceSecondsLeft(60);
  };

  const resetSilenceTimer = () => {
    clearSilenceTimers();
    setSilenceSecondsLeft(60);

    countdownIntervalRef.current = setInterval(() => {
      setSilenceSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 60-second (1 min) silence limit before auto-stopping microphone
    silenceTimeoutRef.current = setTimeout(() => {
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      clearSilenceTimers();
    }, 60000);
  };

  // Initialize SpeechRecognition API with continuous accumulation & strict English
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US'; // Strict English voice recognition

      recognition.onresult = (event) => {
        resetSilenceTimer();
        let interim = '';
        let newFinals = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          const text = res[0].transcript;
          if (res.isFinal) {
            newFinals += (newFinals ? ' ' : '') + text.trim();
          } else {
            interim += text;
          }
        }

        if (newFinals) {
          accumulatedTranscriptRef.current = accumulatedTranscriptRef.current
            ? `${accumulatedTranscriptRef.current} ${newFinals}`
            : newFinals;
        }

        const combined = (accumulatedTranscriptRef.current + (interim ? ` ${interim}` : '')).trim();
        setTranscript(combined);
      };

      recognition.onerror = (event) => {
        // 'no-speech' happens when the user takes a pause to think. DO NOT stop listening!
        if (event.error === 'no-speech') {
          return;
        }
        console.warn('Speech recognition notice:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          shouldListenRef.current = false;
          setIsListening(false);
          clearSilenceTimers();
        }
      };

      recognition.onend = () => {
        // If student is still in speaking mode, restart immediately so 2s pauses never cut them off!
        if (shouldListenRef.current) {
          try {
            recognition.start();
          } catch (e) {
            setTimeout(() => {
              if (shouldListenRef.current) {
                try {
                  recognition.start();
                } catch (err) {}
              }
            }, 150);
          }
        } else {
          setIsListening(false);
          clearSilenceTimers();
        }
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      shouldListenRef.current = false;
      clearSilenceTimers();
    };
  }, []);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clean up human voice audio when component unmounts or closes
  useEffect(() => {
    return () => {
      stopHumanVoice();
      clearSilenceTimers();
    };
  }, []);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. You can type your reflection!');
      return;
    }

    if (isListening) {
      shouldListenRef.current = false;
      clearSilenceTimers();
      try {
        recognitionRef.current.stop();
      } catch (err) {}
      setIsListening(false);
    } else {
      shouldListenRef.current = true;
      // Preserve any previously spoken or typed text so pauses or restarts never lose words
      accumulatedTranscriptRef.current = transcript.trim();
      try {
        recognitionRef.current.start();
        setIsListening(true);
        resetSilenceTimer();
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    }
  };

  const speakText = (text) => {
    if (isMuted) return;
    playHumanVoice(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const stopSpeaking = () => {
    stopHumanVoice();
    setIsSpeaking(false);
  };

  const handleSendReflection = async (textToSend, isExplicitConclude = false) => {
    const input = (textToSend || transcript).trim();
    if (!input || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const previousUserTurns = messages.filter(m => m.sender === 'user').length;
    let currentForwarded = forwardedGoalsList;

    // Turn 1: User speaks entire reflection in one go -> automatically forward incomplete daily goals!
    if (previousUserTurns === 0 && forwardIncompleteDailyGoals) {
      const rolled = forwardIncompleteDailyGoals(todayStr);
      if (rolled && rolled.length > 0) {
        currentForwarded = rolled;
        setForwardedGoalsList(rolled);
      }
    }

    // Add user message
    const userMsg = {
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setTranscript('');
    setIsLoading(true);

    const sessionMinutes = Math.round(sessionSecondsElapsed / 60);

    try {
      // Call NVIDIA API Voice Mentor
      const result = await getNVidiaVoiceReflection({
        morningGoals: todayGoals,
        studentSpeechInput: input,
        conversationHistory: messages,
        forwardedGoals: currentForwarded,
        sessionMinutesElapsed: sessionMinutes,
        isConcluding: isExplicitConclude
      });

      if (isExplicitConclude) {
        setIsSessionConcluded(true);
      }

      const aiMsg = {
        sender: 'ai',
        text: result.content,
        modelUsed: result.model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);

      // Save reflection log in context for student visibility
      if (saveDailyReflection) {
        saveDailyReflection({
          date: todayStr,
          studentReflection: input,
          goalsSnapshot: todayGoals.map(g => ({ title: g.title, progress: g.progress || (g.completed ? 100 : 0), completed: g.completed })),
          forwardedGoals: currentForwarded.map(g => ({ id: g.id, title: g.title })),
          aiFeedback: result.content,
          modelUsed: result.model
        });
      }
      
      // Auto speak AI response aloud
      speakText(result.content);
    } catch (err) {
      console.error('Voice reflection error:', err);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Sorry, an error occurred while generating the AI Voice Mentor response. Please try again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConcludeSession = () => {
    if (isLoading || isSessionConcluded) return;
    handleSendReflection(
      `I am ready to wrap up our deep-dive discussion. Please provide my comprehensive final mastery assessment report, highlight specific technical areas for improvement, and summarize tomorrow's forwarded agenda.`,
      true
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-2xl shadow-lg shadow-brand-500/20 text-white">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-lg sm:text-xl">End-of-Day Voice Reflection</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  English Only 🎙️
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Natural Human Voice 🎧
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  NVIDIA NIM AI Voice
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Reflect in English on your morning goals, get technical corrections, and answer conceptual questions!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 30-Minute Session Progress Tracker */}
        {(() => {
          const userTurnCount = messages.filter(m => m.sender === 'user').length;
          const sessionMinutes = Math.floor(sessionSecondsElapsed / 60);
          const sessionSecs = sessionSecondsElapsed % 60;
          const formattedTime = `${sessionMinutes.toString().padStart(2, '0')}:${sessionSecs.toString().padStart(2, '0')}`;
          const targetSecs = 1800; // 30 minutes target
          const progressPercent = Math.min(100, Math.round((sessionSecondsElapsed / targetSecs) * 100));

          return (
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Clock className={`w-3.5 h-3.5 text-brand-600 dark:text-brand-400 ${!isSessionConcluded ? 'animate-pulse' : ''}`} />
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {formattedTime} <span className="font-sans font-normal text-slate-400">/ 30:00 Target ({progressPercent}%)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                    Round {userTurnCount} Q&A
                  </span>
                  {isSessionConcluded && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      Concluded ✓
                    </span>
                  )}
                </div>

                {userTurnCount >= 1 && !isSessionConcluded && (
                  <button
                    onClick={handleConcludeSession}
                    disabled={isLoading}
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-[11px] shadow-xs transition flex items-center space-x-1 disabled:opacity-50"
                  >
                    <Award className="w-3 h-3" />
                    <span>Finish & Get Final Report 🎓</span>
                  </button>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.max(3, progressPercent)}%` }}
                />
              </div>

              {/* 3 Dynamic Stages */}
              <div className="grid grid-cols-3 gap-2 text-[11px] pt-0.5">
                <div className={`p-1.5 rounded-xl border flex items-center space-x-1.5 ${
                  userTurnCount === 0
                    ? 'bg-brand-500/10 border-brand-500/40 text-brand-700 dark:text-brand-300 font-bold'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {userTurnCount === 0 ? <Mic className="w-3 h-3 text-brand-600 animate-pulse" /> : <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  <span className="truncate">1. Reflection Intake</span>
                </div>

                <div className={`p-1.5 rounded-xl border flex items-center space-x-1.5 ${
                  userTurnCount >= 1 && !isSessionConcluded
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-700 dark:text-indigo-300 font-bold'
                    : isSessionConcluded
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                }`}>
                  <Brain className="w-3 h-3 text-indigo-500" />
                  <span className="truncate">2. Cross-Questioning</span>
                </div>

                <div className={`p-1.5 rounded-xl border flex items-center space-x-1.5 ${
                  isSessionConcluded
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                }`}>
                  <Award className="w-3 h-3 text-emerald-500" />
                  <span className="truncate">3. Final Evaluation</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Morning Goals Bar Summary */}
        <div className="bg-slate-100 dark:bg-slate-950 px-4 py-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Today's Morning Goals:</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {todayGoals.length} Goals Registered
            </span>
          </div>

          {todayGoals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {todayGoals.map((g) => (
                <span
                  key={g.id}
                  className={`text-[11px] px-3 py-1 rounded-xl font-semibold border flex items-center gap-1.5 ${
                    g.completed || g.progress === 100
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{g.title}</span>
                  <strong className="ml-1">({g.completed ? '100%' : `${g.progress || 0}%`})</strong>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No specific goals set for today. You can still speak about what you learned!</p>
          )}
        </div>

        {/* Forwarded to Tomorrow Banner */}
        {forwardedGoalsList.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-brand-500/10 dark:from-amber-950/30 dark:via-indigo-950/30 dark:to-slate-900 px-4 py-2.5 border-b border-indigo-500/30 space-y-1.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                <span>Forwarded to Tomorrow's Agenda ({forwardedGoalsList.length} Tasks Auto-Rolled Over):</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-white/80 dark:bg-slate-900 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                Rolled Over ⏩
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {forwardedGoalsList.map((g) => (
                <span key={g.id} className="text-[11px] px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-indigo-500" />
                  <span>{g.title}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Voice Reflection Conversation Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 space-y-3 border ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white border-brand-500 shadow-md'
                    : 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] opacity-80 pb-1 border-b border-white/10 dark:border-slate-800">
                  <span className="font-bold flex items-center gap-1">
                    {msg.sender === 'user' ? '👤 You (Voice Reflection)' : '🤖 NVIDIA AI Voice Mentor'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                  {msg.text}
                </div>

                {msg.sender === 'ai' && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <button
                      onClick={() => speakText(msg.text)}
                      className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Speak Aloud</span>
                    </button>

                    {msg.modelUsed && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-400 shadow-sm">
                <RefreshCw className="w-4 h-4 text-brand-600 dark:text-brand-400 animate-spin" />
                <span>NVIDIA AI Mentor is analyzing your reflection & preparing deep questions...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Live Audio Waveform & Speech Output Controls */}
        {isSpeaking && (
          <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between text-xs animate-pulse">
            <span className="font-bold flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span>AI Mentor Speaking...</span>
            </span>
            <button
              onClick={stopSpeaking}
              className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold flex items-center gap-1"
            >
              <Pause className="w-3 h-3" />
              <span>Pause Speech</span>
            </button>
          </div>
        )}

        {/* Input & Voice Controls Footer */}
        <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-3">
          
          {/* Turn Guidance Notice */}
          {(() => {
            const userTurnCount = messages.filter(m => m.sender === 'user').length;
            if (userTurnCount === 0) {
              return (
                <div className="p-3 bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-950/40 dark:to-indigo-950/40 border border-brand-200 dark:border-brand-800/60 rounded-2xl text-xs text-brand-900 dark:text-brand-200 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-extrabold uppercase tracking-wider text-[10px] text-brand-700 dark:text-brand-300">Turn 1: Speak Entire Reflection All at Once</span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      Speak everything in one go: completed goals, new concepts learned, and incomplete tasks. The mentor will roll over pending tasks to tomorrow and initiate our 30-minute deep-dive cross-examination!
                    </p>
                  </div>
                </div>
              );
            } else if (!isSessionConcluded) {
              return (
                <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl text-xs text-indigo-900 dark:text-indigo-200 flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2">
                    <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-extrabold uppercase tracking-wider text-[10px] text-indigo-700 dark:text-indigo-300">
                        Deep-Dive Cross-Questioning (Round {userTurnCount} • Probing Until Satisfied)
                      </span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                        Answer each question in your own words. The mentor will test your depth across all topics until satisfied. Click "Finish & Get Final Report" when ready!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleConcludeSession}
                    disabled={isLoading}
                    className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-xs transition shrink-0 hidden sm:flex items-center space-x-1"
                  >
                    <Award className="w-3 h-3" />
                    <span>Finish</span>
                  </button>
                </div>
              );
            } else {
              return (
                <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start space-x-2">
                  <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-extrabold uppercase tracking-wider text-[10px] text-emerald-700 dark:text-emerald-300">
                      30-Minute Reflection Concluded & Mastered 🎓
                    </span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      Your comprehensive mastery evaluation has been recorded and unfinished tasks forwarded to tomorrow.
                    </p>
                  </div>
                </div>
              );
            }
          })()}

          {/* Continuous Voice Recording Banner with 60-second Silence Timer */}
          {isListening && (
            <div className="p-3.5 bg-gradient-to-r from-rose-50 via-amber-50 to-indigo-50 dark:from-rose-950/40 dark:via-amber-950/40 dark:to-indigo-950/40 border border-rose-300 dark:border-rose-800 rounded-2xl text-xs text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs animate-fade-in">
              <div className="flex items-center space-x-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                </span>
                <div className="space-y-0.5">
                  <div className="font-extrabold flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <span>Continuous Voice Recording (English)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
                      Pauses Allowed (Up to 1 min)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Take your time! Pausing for several seconds will not cut you off.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="font-mono text-[11px] bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5 shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>Silence timeout: <strong className={silenceSecondsLeft <= 10 ? 'text-rose-600 font-extrabold' : 'text-slate-900 dark:text-white'}>{silenceSecondsLeft}s</strong></span>
                </span>
                <button
                  onClick={toggleListening}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
                >
                  Done Speaking ⏸️
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            
            {/* Mic Toggle Button */}
            <button
              onClick={toggleListening}
              className={`p-3.5 rounded-2xl font-bold transition flex items-center justify-center shrink-0 shadow-lg ${
                isListening
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 scale-105 ring-4 ring-rose-500/20'
                  : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/20 hover:scale-105'
              }`}
              title={isListening ? 'Stop Microphone (Done Speaking)' : 'Start Voice Input (Mic)'}
            >
              {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Speech-to-text / Manual Text Input */}
            <input
              type="text"
              value={transcript}
              onChange={(e) => {
                setTranscript(e.target.value);
                accumulatedTranscriptRef.current = e.target.value;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendReflection();
              }}
              placeholder={
                isListening
                  ? 'Listening continuously in English... Speak freely, pauses allowed!'
                  : messages.filter(m => m.sender === 'user').length === 0
                    ? 'Speak or type your full day reflection all at once...'
                    : 'Type or speak your answers to the conceptual questions...'
              }
              className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-brand-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none transition"
            />

            {/* Mute/Unmute Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-2xl border transition shrink-0 ${
                isMuted
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
                  : 'bg-slate-100 dark:bg-slate-900 text-brand-600 dark:text-brand-400 border-slate-200 dark:border-slate-800'
              }`}
              title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              onClick={() => handleSendReflection()}
              disabled={isLoading || !transcript.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition flex items-center space-x-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">
                {messages.filter(m => m.sender === 'user').length === 0
                  ? 'Submit Full Reflection & Forward Tasks 🚀'
                  : 'Submit Answer 💬'}
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

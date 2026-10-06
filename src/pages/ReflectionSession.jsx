import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { useLearning } from '../context/LearningContext';
import { getNVidiaVoiceReflection } from '../services/nvidiaVoiceMentorService';
import { playHumanVoice, stopHumanVoice } from '../services/humanVoiceService';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Target, 
  Brain, 
  Cpu, 
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  History,
  MessageSquare,
  Pause,
  Award,
  Clock,
  Zap,
  Radio,
  Play
} from 'lucide-react';

export function ReflectionSession() {
  const navigate = useNavigate();
  const { dailyGoals, getActivePhaseDetails, saveDailyReflection, forwardIncompleteDailyGoals, sidebarCollapsed } = useLearning();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activePhase = getActivePhaseDetails();

  // Today's daily goals (both AI assigned & custom student added goals)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayGoals = dailyGoals ? dailyGoals.filter(g => g.date === todayStr || !g.date || g.rolledOverFrom) : [];
  const completedGoalsCount = todayGoals.filter(g => g.completed || g.progress === 100).length;

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

  // Formulate initial AI greeting in strict English
  const initialAiGreeting = todayGoals.length > 0
    ? `Hello! I am your AI Voice Mentor. Here are the daily goals you set earlier today:\n${todayGoals.map((g, i) => `${i + 1}. ${g.title} (${g.completed ? '100% Completed' : `${g.progress || 0}% Done`})`).join('\n')}\n\nPlease share your complete day's reflection all at once—what you finished, new technical concepts learned, and what remained unfinished. Once received, unfinished goals will be automatically forwarded to tomorrow, and we will begin our comprehensive 30-minute deep-dive dialogue. I will systematically cross-question you across all your topics until complete conceptual mastery is verified!`
    : `Hello! I am your AI Voice Mentor. Please share your complete day's reflection all at once—what programming topics, libraries, or projects you studied today, and any challenges you faced! We will then begin our comprehensive 30-minute deep-dive dialogue, cross-questioning you across all your topics until complete conceptual mastery is verified.`;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [silenceSecondsLeft, setSilenceSecondsLeft] = useState(60);
  const [sessionSecondsElapsed, setSessionSecondsElapsed] = useState(0);
  const [isSessionConcluded, setIsSessionConcluded] = useState(false);

  // 30-Minute Session Duration Timer
  useEffect(() => {
    if (isSessionConcluded) return;
    const interval = setInterval(() => {
      setSessionSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSessionConcluded]);

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

  // Human voice audio cleanup
  useEffect(() => {
    return () => {
      stopHumanVoice();
      clearSilenceTimers();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. You can type your reflection below!');
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

  const speakText = (rawText) => {
    if (isMuted) return;
    playHumanVoice(
      rawText,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const stopSpeaking = () => {
    stopHumanVoice();
    setIsSpeaking(false);
  };

  const handleSendUserText = async (textToSend, isExplicitConclude = false) => {
    const text = textToSend || transcript;
    if (!text.trim()) return;

    const userMessage = {
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const previousUserTurns = messages.filter(m => m.sender === 'user').length;
    let currentForwarded = forwardedGoalsList;

    // TURN 1: User is sharing their full reflection all at once -> auto-forward incomplete daily goals!
    if (previousUserTurns === 0 && forwardIncompleteDailyGoals) {
      const rolled = forwardIncompleteDailyGoals(todayStr);
      if (rolled && rolled.length > 0) {
        currentForwarded = rolled;
        setForwardedGoalsList(rolled);
      }
    }

    setMessages(prev => [...prev, userMessage]);
    setTranscript('');
    setIsLoading(true);

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const sessionMinutes = Math.round(sessionSecondsElapsed / 60);

    try {
      const result = await getNVidiaVoiceReflection({
        morningGoals: todayGoals,
        activePhaseTitle: activePhase.title,
        studentSpeechInput: text.trim(),
        conversationHistory: messages,
        forwardedGoals: currentForwarded,
        sessionMinutesElapsed: sessionMinutes,
        isConcluding: isExplicitConclude
      });

      if (isExplicitConclude) {
        setIsSessionConcluded(true);
      }

      const aiMessage = {
        sender: 'ai',
        text: result.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: result.model || 'NVIDIA NIM Voice'
      };

      setMessages(prev => [...prev, aiMessage]);

      saveDailyReflection({
        date: todayStr,
        studentReflection: text.trim(),
        goalsSnapshot: todayGoals.map(g => ({ title: g.title, progress: g.progress, completed: g.completed })),
        forwardedGoals: currentForwarded.map(g => ({ id: g.id, title: g.title })),
        aiFeedback: result.content,
        modelUsed: result.model || 'NVIDIA NIM Voice AI'
      });

      // Speak AI response aloud
      speakText(result.content);
    } catch (err) {
      console.error('Voice reflection error:', err);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Sorry, an error occurred while generating the AI Voice Mentor response. Please retry!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConcludeSession = () => {
    if (isLoading || isSessionConcluded) return;
    handleSendUserText(
      `I am ready to wrap up our deep-dive discussion. Please provide my comprehensive final mastery assessment report, highlight specific technical areas for improvement, and summarize tomorrow's forwarded agenda.`,
      true
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className={`flex-1 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} transition-all duration-300 flex flex-col min-w-0`}>
        <TopHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 lg:p-7 flex-1 flex flex-col space-y-4 max-w-7xl mx-auto w-full">
          {/* Top Compact Studio Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 px-5 py-3.5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center space-x-3 min-w-0">
              <button
                onClick={() => navigate('/goals')}
                className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition shrink-0"
                title="Back to Goals Tracker"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-1.5 truncate">
                    <Mic className="w-4 h-4 text-brand-600 dark:text-brand-400 animate-pulse shrink-0" />
                    <span>Live Reflection Studio</span>
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>English Only</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {activePhase?.title || 'Phase Progression'} • Deep-Dive Technical Mentorship
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => speakText("Hello! I am your AI Voice Mentor. My voice sounds natural and human, and I am ready to evaluate your programming reflection today!")}
                className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-xs font-bold transition flex items-center space-x-1.5"
                title="Test human voice playback"
              >
                <Volume2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">Test Voice</span>
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-xl text-xs font-bold border transition flex items-center ${
                  isMuted
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
                title={isMuted ? 'Audio Muted (Click to Unmute)' : 'Audio Enabled'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
              </button>

              <button
                onClick={() => navigate('/reflections')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
              >
                <History className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>History</span>
              </button>
            </div>
          </div>

          {/* 2-Column Responsive Studio Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 items-start">
            
            {/* Left 8 Columns: Live Chat & Audio Studio */}
            <div className="lg:col-span-8 flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden h-[calc(100vh-175px)] min-h-[560px]">
              
              {/* Studio Subheader */}
              <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    NVIDIA Voice AI Mentor
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-500/20">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Neural Voice</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {messages.filter(m => m.sender === 'user').length >= 1 && !isSessionConcluded && (
                    <button
                      onClick={handleConcludeSession}
                      disabled={isLoading}
                      className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-[11px] shadow-xs transition flex items-center space-x-1 disabled:opacity-50"
                      title="Wrap up discussion and get your final report"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Finish & Final Report 🎓</span>
                    </button>
                  )}
                  {isSpeaking && (
                    <button
                      onClick={stopSpeaking}
                      className="px-2.5 py-1 rounded-xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] transition flex items-center gap-1"
                    >
                      <Pause className="w-3 h-3" />
                      <span>Pause Speech</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-slate-950/30 custom-scrollbar">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 space-y-2.5 transition ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-xs rounded-tr-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 shadow-xs rounded-tl-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] opacity-75 pb-1.5 border-b border-black/5 dark:border-white/5">
                        <span className="font-bold flex items-center gap-1.5">
                          {msg.sender === 'user' ? '👤 Your Reflection' : '🤖 AI Mentor'}
                        </span>
                        <span className="font-mono text-[10px]">{msg.timestamp}</span>
                      </div>

                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                        {msg.text}
                      </div>

                      {msg.sender === 'ai' && (
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                          <button
                            onClick={() => speakText(msg.text)}
                            className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 transition"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen Audio 🔊</span>
                          </button>
                          {msg.modelUsed && (
                            <span className="text-[10px] font-mono text-slate-400 opacity-60">
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
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 flex items-center space-x-2.5 text-xs text-slate-600 dark:text-slate-400 shadow-xs">
                      <RefreshCw className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 animate-spin" />
                      <span>AI Mentor is evaluating your concepts & cross-questions...</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Bottom Input Area */}
              <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 space-y-2 shrink-0">
                {isListening && (
                  <div className="px-3.5 py-2 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2 shadow-xs animate-fade-in">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" />
                      <span className="font-bold truncate">Continuous English Voice Recording (pauses allowed)</span>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="font-mono text-[11px] font-bold">
                        Silence: <strong className={silenceSecondsLeft <= 10 ? 'text-rose-600' : ''}>{silenceSecondsLeft}s</strong>
                      </span>
                      <button
                        onClick={toggleListening}
                        className="px-2.5 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] transition"
                      >
                        Done ⏸️
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleListening}
                    className={`p-3 rounded-2xl font-bold transition flex items-center justify-center shrink-0 shadow-md ${
                      isListening
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20 scale-105 ring-4 ring-rose-500/20'
                        : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/20 hover:scale-105'
                    }`}
                    title={isListening ? 'Stop Recording (Done)' : 'Start Voice Input (Mic)'}
                  >
                    {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <input
                    type="text"
                    value={transcript}
                    onChange={(e) => {
                      setTranscript(e.target.value);
                      accumulatedTranscriptRef.current = e.target.value;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendUserText();
                    }}
                    placeholder={
                      isListening
                        ? 'Listening continuously in English... Speak freely, pauses allowed!'
                        : messages.filter(m => m.sender === 'user').length === 0
                          ? 'Speak or type your entire day reflection all at once...'
                          : 'Type or speak your answer to the cross-questions...'
                    }
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-brand-500 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none transition"
                  />

                  <button
                    onClick={() => handleSendUserText()}
                    disabled={isLoading || !transcript.trim()}
                    className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/20 disabled:opacity-50 transition flex items-center space-x-1.5 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {messages.filter(m => m.sender === 'user').length === 0 ? 'Submit Full Reflection' : 'Submit Answer'}
                    </span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right 4 Columns: Context & Progress Cockpit */}
            <div className="lg:col-span-4 space-y-4">
              {(() => {
                const userTurnCount = messages.filter(m => m.sender === 'user').length;
                const sessionMinutes = Math.floor(sessionSecondsElapsed / 60);
                const sessionSecs = sessionSecondsElapsed % 60;
                const formattedTime = `${sessionMinutes.toString().padStart(2, '0')}:${sessionSecs.toString().padStart(2, '0')}`;
                const targetSecs = 1800; // 30 mins
                const progressPercent = Math.min(100, Math.round((sessionSecondsElapsed / targetSecs) * 100));

                return (
                  <>
                    {/* 30-Minute Target Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className={`w-4 h-4 text-brand-600 dark:text-brand-400 ${!isSessionConcluded ? 'animate-pulse' : ''}`} />
                          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                            30-Min Deep Dive Target
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                          Round {userTurnCount} Q&A
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                          {formattedTime}
                          <span className="text-xs font-normal text-slate-400 font-sans ml-1.5">/ 30:00 Target</span>
                        </div>
                        <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{progressPercent}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${Math.max(4, progressPercent)}%` }}
                        />
                      </div>

                      {/* 3-Step Stages */}
                      <div className="space-y-2 pt-1">
                        <div className={`p-2.5 rounded-2xl border transition flex items-center space-x-2.5 text-xs ${
                          userTurnCount === 0
                            ? 'bg-brand-500/10 border-brand-500/30 text-brand-800 dark:text-brand-200 font-bold'
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                        }`}>
                          {userTurnCount === 0 ? <Mic className="w-3.5 h-3.5 text-brand-600 shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          <span className="truncate">1. Full Reflection Intake</span>
                        </div>

                        <div className={`p-2.5 rounded-2xl border transition flex items-center space-x-2.5 text-xs ${
                          userTurnCount >= 1 && !isSessionConcluded
                            ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-800 dark:text-indigo-200 font-bold'
                            : isSessionConcluded
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}>
                          <Brain className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="truncate">2. Cross-Questioning (Until Satisfied)</span>
                        </div>

                        <div className={`p-2.5 rounded-2xl border transition flex items-center space-x-2.5 text-xs ${
                          isSessionConcluded
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200 font-bold'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}>
                          <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">3. Final Mastery Evaluation</span>
                        </div>
                      </div>

                      {userTurnCount >= 1 && !isSessionConcluded && (
                        <button
                          onClick={handleConcludeSession}
                          disabled={isLoading}
                          className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                          <Award className="w-4 h-4" />
                          <span>Finish Session & Get Final Report 🎓</span>
                        </button>
                      )}
                    </div>

                    {/* Today's Goals Snapshot Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                            Today's Goals ({completedGoalsCount}/{todayGoals.length})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      {todayGoals.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                          {todayGoals.map((g) => (
                            <div
                              key={g.id}
                              className="text-xs p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between"
                            >
                              <span className="truncate pr-2 font-medium">{g.title}</span>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                g.completed || g.progress === 100
                                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                              }`}>
                                {g.completed || g.progress === 100 ? '100% ✓' : `${g.progress || 0}%`}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No scheduled goals for today. Your reflection will be evaluated on the concepts and projects you share!</p>
                      )}
                    </div>

                    {/* Forwarded to Tomorrow Banner if present */}
                    {forwardedGoalsList.length > 0 && (
                      <div className="bg-amber-500/10 dark:bg-amber-950/20 rounded-3xl p-4 border border-amber-500/30 space-y-2">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          <span>Rolled to Tomorrow ({forwardedGoalsList.length})</span>
                        </div>
                        <div className="space-y-1">
                          {forwardedGoalsList.map((g) => (
                            <div key={g.id} className="text-[11px] truncate text-slate-700 dark:text-slate-300">
                              • {g.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

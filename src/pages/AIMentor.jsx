import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { useLearning } from '../context/LearningContext';
import { apiRequest } from '../services/api';
import { AI_MENTOR_SYSTEM_PROMPT, generateSystemPromptResponse } from '../data/aiMentorSystemPrompt';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Terminal, 
  Copy, 
  Check, 
  Plus,
  Trash2,
  Code2,
  Cpu,
  Layers,
  Zap,
  ArrowUp,
  MessageSquare
} from 'lucide-react';

export function AIMentor() {
  const { 
    sidebarCollapsed,
    simulatedLoading, 
    simulatedError, 
    setSimulatedError, 
    aiMentorHistory,
    setAiMentorHistory
  } = useLearning();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [messages, setMessages] = useState(() => {
    return Array.isArray(aiMentorHistory) ? aiMentorHistory : [];
  });

  useEffect(() => {
    if (Array.isArray(aiMentorHistory)) {
      setMessages(aiMentorHistory);
    }
  }, [aiMentorHistory]);

  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const suggestedCards = [
    { title: "Explain Async / Await", subtitle: "JavaScript Promises & Async concepts", prompt: "Explain Async / Await & Promises in simple terms with code examples." },
    { title: "React useEffect Hook", subtitle: "Lifecycle & dependency array", prompt: "How does useEffect hook work in React 18 with examples?" },
    { title: "JavaScript Closures", subtitle: "Lexical Scope & Encapsulation", prompt: "What is a JavaScript Closure? Explain with real-world examples." },
    { title: "CSS Flexbox vs Grid", subtitle: "1D vs 2D Layout System", prompt: "Compare CSS Flexbox vs Grid and explain when to use which." }
  ];

  const location = useLocation();
  const initialHandledRef = useRef(false);

  useEffect(() => {
    if (initialHandledRef.current) return;
    const searchParams = new URLSearchParams(location.search);
    const incomingPrompt = location.state?.prompt || searchParams.get('prompt');
    if (incomingPrompt) {
      initialHandledRef.current = true;
      handleSend(incomingPrompt);
    }
  }, [location]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleCopyCodeSnippet = (codeText, idx) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleNewChat = () => {
    setMessages([]);
    setAiMentorHistory([]);
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    const userMessage = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedWithUser = [...messages, userMessage];
    setMessages(updatedWithUser);
    setAiMentorHistory(updatedWithUser);

    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    try {
      const result = await apiRequest('/api/ai/mentor', {
        method: 'POST',
        body: JSON.stringify({
          query,
          systemPrompt: AI_MENTOR_SYSTEM_PROMPT,
          conversationHistory: messages
        })
      });
      if (!result.content) throw new Error('Mentor request returned no response.');

      const aiResponseMsg = {
        sender: 'ai',
        text: result.content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const finalUpdated = [...updatedWithUser, aiResponseMsg];
      setMessages(finalUpdated);
      setAiMentorHistory(finalUpdated);
    } catch (error) {
      console.warn('AI Mentor server request failed:', error.message);
      const fallbackText = generateSystemPromptResponse(query);
      const aiResponseMsg = {
        sender: 'ai',
        text: fallbackText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const finalUpdated = [...updatedWithUser, aiResponseMsg];
      setMessages(finalUpdated);
      setAiMentorHistory(finalUpdated);
    } finally {
      setIsTyping(false);
    }
  };

  // Render formatted markdown (headers, bold, tables, lists, code)
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    const lines = rawText.split('\n');
    const elements = [];
    let inTable = false;
    let tableHeader = [];
    let tableRows = [];
    let currentParagraph = [];

    const parseInline = (text) => {
      const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={idx} className="px-1.5 py-0.5 mx-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 font-mono text-xs border border-indigo-200 dark:border-indigo-800">
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      });
    };

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const pText = currentParagraph.join(' ');
        if (pText.trim()) {
          elements.push(
            <p key={`p-${elements.length}`} className="mb-2 leading-relaxed text-slate-800 dark:text-slate-200 text-sm">
              {parseInline(pText)}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    const flushTable = () => {
      if (tableHeader.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-bold">
                <tr>
                  {tableHeader.map((cell, cIdx) => (
                    <th key={cIdx} className="px-3 py-2 text-left font-bold">
                      {parseInline(cell.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white dark:bg-slate-900/50">
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-slate-700 dark:text-slate-300">
                        {parseInline(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableHeader = [];
        tableRows = [];
      }
      inTable = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('|') && line.endsWith('|')) {
        flushParagraph();
        const cells = line.split('|').slice(1, -1);
        if (cells.every(c => c.trim().match(/^:?-+:?$/))) {
          continue;
        }
        if (!inTable) {
          inTable = true;
          tableHeader = cells;
        } else {
          tableRows.push(cells);
        }
        continue;
      } else if (inTable) {
        flushTable();
      }

      if (line.startsWith('### ')) {
        flushParagraph();
        elements.push(
          <h4 key={`h3-${elements.length}`} className="text-sm sm:text-base font-extrabold text-brand-600 dark:text-brand-400 mt-4 mb-2">
            {parseInline(line.replace(/^###\s+/, ''))}
          </h4>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        flushParagraph();
        elements.push(
          <h3 key={`h2-${elements.length}`} className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-5 mb-2 border-b border-slate-200 dark:border-slate-800 pb-1.5">
            {parseInline(line.replace(/^##\s+/, ''))}
          </h3>
        );
        continue;
      }

      if (line.match(/^[-*]\s+/)) {
        flushParagraph();
        elements.push(
          <div key={`li-${elements.length}`} className="flex items-start space-x-2 my-1 pl-1 text-slate-800 dark:text-slate-200 text-sm">
            <span className="text-brand-500 font-bold shrink-0 mt-0.5">•</span>
            <span>{parseInline(line.replace(/^[-*]\s+/, ''))}</span>
          </div>
        );
        continue;
      }

      if (line.match(/^\d+\.\s+/)) {
        flushParagraph();
        const numMatch = line.match(/^(\d+)\.\s+(.*)/);
        elements.push(
          <div key={`nli-${elements.length}`} className="flex items-start space-x-2 my-1 pl-1 text-slate-800 dark:text-slate-200 text-sm">
            <span className="text-brand-600 dark:text-brand-400 font-bold shrink-0 text-xs mt-0.5">{numMatch[1]}.</span>
            <span>{parseInline(numMatch[2])}</span>
          </div>
        );
        continue;
      }

      if (!line) {
        flushParagraph();
        continue;
      }

      currentParagraph.push(line);
    }

    flushParagraph();
    if (inTable) flushTable();

    return <div className="space-y-1.5">{elements}</div>;
  };

  const renderMessageContent = (text, msgIdx) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        let lang = 'CODE';
        let codeBody = part.slice(3, -3).trim();

        if (lines[0].match(/^[a-zA-Z0-9_-]+$/)) {
          lang = lines[0].toUpperCase();
          codeBody = lines.slice(1).join('\n');
        }

        const snippetKey = `${msgIdx}-${i}`;

        return (
          <div key={i} className="my-3.5 rounded-2xl overflow-hidden bg-slate-900 text-emerald-300 border border-slate-700 shadow-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700 text-[11px] font-mono text-slate-300">
              <span className="flex items-center space-x-1.5 text-brand-400 font-bold">
                <Terminal className="w-3.5 h-3.5 text-brand-400" />
                <span>{lang}</span>
              </span>
              <button
                onClick={() => handleCopyCodeSnippet(codeBody, snippetKey)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px] font-bold transition"
              >
                {copiedIndex === snippetKey ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                )}
                <span>{copiedIndex === snippetKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
              <code>{codeBody}</code>
            </pre>
          </div>
        );
      }

      return (
        <div key={i}>
          {renderFormattedText(part)}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className={`flex-1 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} transition-all duration-300 flex flex-col min-w-0 h-screen`}>
        <TopHeader setMobileOpen={setMobileOpen} />

        {/* ChatGPT Style Full Height Layout Container */}
        <div className="flex-1 flex flex-col min-h-0 relative max-w-4xl mx-auto w-full px-4 sm:px-6">

          {/* Minimal Top Controls Bar */}
          <header className="py-3 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Mentor</span>
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleNewChat}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition flex items-center space-x-1.5"
                title="Start New Conversation"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Chat</span>
              </button>
            )}
          </header>

          {/* State Conditional Display */}
          {simulatedLoading ? (
            <LoadingSpinner text="Connecting to AI Mentor..." />
          ) : simulatedError ? (
            <ErrorAlert 
              title="AI Mentor Connection Error"
              message="Simulated error flag is active. Click below to clear."
              onRetry={() => setSimulatedError(false)}
            />
          ) : (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              
              {/* CHAT MESSAGES OR CLEAN ChatGPT WELCOME SCREEN */}
              {messages.length === 0 ? (
                /* Ultra-Clean ChatGPT-Style Empty Screen */
                <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in p-6 my-auto">
                  <div className="text-center space-y-3 max-w-md">
                    <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                      What can I help with today?
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Ask any web development, coding, or architecture question to receive clear, practical explanations.
                    </p>
                  </div>

                  {/* Clean 2x2 ChatGPT Prompt Suggestion Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                    {suggestedCards.map((card, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(card.prompt)}
                        className="text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-brand-500/80 transition-all hover:-translate-y-0.5 group shadow-2xs"
                      >
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                          {card.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {card.subtitle}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Sleek Full-Height Chat Stream */
                <div className="flex-1 overflow-y-auto py-6 space-y-6 custom-scrollbar pr-1">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start space-x-3 max-w-3xl ${
                        msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs ${
                        msg.sender === 'user' ? 'bg-brand-600' : 'bg-gradient-to-tr from-brand-600 to-indigo-600'
                      }`}>
                        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      <div className={`rounded-3xl p-5 text-sm space-y-2 border ${
                        msg.sender === 'user'
                          ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs'
                      }`}>
                        <div className="flex items-center justify-between text-[11px] opacity-70 font-mono pb-1 border-b border-white/10 dark:border-slate-800">
                          <span className="font-bold">{msg.sender === 'user' ? 'You' : 'AI Mentor'}</span>
                          <span>{msg.time}</span>
                        </div>

                        <div className="text-sm space-y-2">
                          {renderMessageContent(msg.text, idx)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs pl-2 animate-pulse">
                      <Bot className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      <span>AI Mentor is typing...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* ChatGPT Floating Bottom Input Container */}
              <div className="p-3 sm:p-4 bg-transparent shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="relative flex items-center"
                >
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder="Message AI Mentor..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus:border-brand-500 rounded-3xl pl-5 pr-14 py-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-lg focus:outline-none transition"
                  />
                  <button
                    type="submit"
                    disabled={!inputMsg.trim()}
                    className="absolute right-2 p-2 bg-brand-600 disabled:opacity-30 hover:bg-brand-500 text-white rounded-full transition shadow-md"
                    title="Send message"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[3]" />
                  </button>
                </form>
                <div className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2 font-mono">
                  AI Mentor can make mistakes. Verify important code logic.
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

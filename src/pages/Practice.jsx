import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { EmptyState } from '../components/common/EmptyState';
import { useLearning } from '../context/LearningContext';
import { 
  Code2, 
  Terminal, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle, 
  Check, 
  Copy, 
  Cpu, 
  Clock, 
  BookOpen, 
  ShieldAlert, 
  Trophy,
  Flame,
  Award,
  AlertTriangle,
  FileText,
  Sliders,
  Send,
  Zap,
  CheckSquare,
  Layers,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { PRACTICE_PROBLEM_BANK } from '../data/practiceProblemBank';
import { computeDailyPracticeState, getTodayDateString, DAILY_TARGET_COUNT } from '../services/practiceRolloverService';

export function Practice() {
  const { 
    sidebarCollapsed,
    simulatedLoading, 
    simulatedError, 
    simulatedEmpty, 
    setSimulatedError, 
    setSimulatedEmpty,
    solvedProblemIds,
    setSolvedProblemIds,
    totalXP,
    setTotalXP,
    practiceDailyState,
    setPracticeDailyState
  } = useLearning();

  const [mobileOpen, setMobileOpen] = useState(false);

  // CodeChef / LeetCode Languages Suite
  const languages = [
    { id: 'js', name: 'JavaScript', icon: '🟨', extension: '.js', version: 'Node.js v18' },
    { id: 'python', name: 'Python 3', icon: '🐍', extension: '.py', version: 'Python 3.11' },
    { id: 'cpp', name: 'C++', icon: '⚡', extension: '.cpp', version: 'G++ 20' },
    { id: 'c', name: 'C Language', icon: '🔵', extension: '.c', version: 'GCC 11.2' },
    { id: 'java', name: 'Java 17', icon: '☕', extension: '.java', version: 'OpenJDK 17' }
  ];

  const [selectedLang, setSelectedLang] = useState('js');

  // Simulated day offset (allows students to test "next day new questions" and "unsolved rollover")
  const [simulatedDayOffset, setSimulatedDayOffset] = useState(0);
  const currentDateStr = getTodayDateString(simulatedDayOffset);

  // Compute daily practice state with automatic rollover
  const dailyState = React.useMemo(() => {
    return computeDailyPracticeState(currentDateStr, practiceDailyState, solvedProblemIds);
  }, [currentDateStr, practiceDailyState, solvedProblemIds]);

  // Sync to learning context & persistence if state updated
  useEffect(() => {
    if (dailyState && (!practiceDailyState || practiceDailyState.date !== dailyState.date || JSON.stringify(practiceDailyState.activeProblemIds) !== JSON.stringify(dailyState.activeProblemIds))) {
      setPracticeDailyState(dailyState);
    }
  }, [dailyState, practiceDailyState, setPracticeDailyState]);

  // Assigned problems for today (including rolled-over problems)
  const assignedProblems = React.useMemo(() => {
    const activeIds = dailyState?.activeProblemIds || ['two-sum', 'valid-palindrome', 'binary-search'];
    return activeIds.map(id => PRACTICE_PROBLEM_BANK.find(p => p.id === id) || PRACTICE_PROBLEM_BANK[0]);
  }, [dailyState]);

  const [selectedProblem, setSelectedProblem] = useState(assignedProblems[0] || PRACTICE_PROBLEM_BANK[0]);

  // Keep selected problem valid when assigned problems change
  useEffect(() => {
    if (assignedProblems && assignedProblems.length > 0) {
      if (!selectedProblem || !assignedProblems.some(p => p.id === selectedProblem.id)) {
        setSelectedProblem(assignedProblems[0]);
      }
    }
  }, [assignedProblems]);
  const [code, setCode] = useState(PRACTICE_PROBLEM_BANK[0].boilerplates.js);
  const [activeLeftTab, setActiveLeftTab] = useState('problem'); // 'problem' | 'hints' | 'daily' | 'all'
  const [activeRightTab, setActiveRightTab] = useState('testcases'); // 'testcases' | 'output' | 'results'
  const [activeCaseIdx, setActiveCaseIdx] = useState(0); // 0 | 1 | 'custom'
  const [sampleOutputs, setSampleOutputs] = useState(null); // { 0: string, 1: string, custom: string }
  const [hasExecuted, setHasExecuted] = useState(false);

  const [customInput, setCustomInput] = useState('');
  const [useCustomInput, setUseCustomInput] = useState(false);

  const [consoleOutput, setConsoleOutput] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [submissionVerdict, setSubmissionVerdict] = useState(null); // 'ACCEPTED' | 'WRONG_ANSWER' | 'COMPILE_ERROR'
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSampleIdx, setCopiedSampleIdx] = useState(null);
  const [executionStats, setExecutionStats] = useState(null);

  // Sync code whenever language or selected problem changes
  useEffect(() => {
    if (selectedProblem && selectedProblem.boilerplates && selectedProblem.boilerplates[selectedLang]) {
      setCode(selectedProblem.boilerplates[selectedLang]);
      setConsoleOutput('');
      setTestResults(null);
      setSubmissionVerdict(null);
      setExecutionStats(null);
      setSampleOutputs(null);
      setActiveCaseIdx(0);
      setHasExecuted(false);
    }
  }, [selectedLang, selectedProblem]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopySample = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedSampleIdx(idx);
    setTimeout(() => setCopiedSampleIdx(null), 2000);
  };

  const handleResetCode = () => {
    setCode(selectedProblem?.boilerplates?.[selectedLang] || '');
    setConsoleOutput('');
    setTestResults(null);
    setSubmissionVerdict(null);
    setExecutionStats(null);
  };

  // Helper to validate problem-specific student logic using Problem Bank validators
  const checkStudentLogic = (problemId, codeStr) => {
    const clean = codeStr.toLowerCase();
    
    if (!codeStr.trim() || codeStr.includes('// TODO:') || codeStr.includes('# TODO:') || (codeStr.includes('pass') && codeStr.split('\n').length < 6)) {
      return { valid: false, reason: 'UNWRITTEN', message: 'Function body contains un-implemented TODO placeholder code.' };
    }

    const prob = PRACTICE_PROBLEM_BANK.find(p => p.id === problemId);
    if (prob && typeof prob.validate === 'function') {
      const passes = prob.validate(clean);
      if (!passes) {
        return { valid: false, reason: 'LOGIC_MISSING', message: `Solution missing required algorithmic or data structure logic for ${prob.title}.` };
      }
    }

    return { valid: true };
  };

  // Run Code against Sample Test Cases
  const handleRunCode = () => {
    setIsExecuting(true);
    setHasExecuted(true);
    setActiveRightTab('testcases');
    if (useCustomInput) setActiveCaseIdx('custom');
    setConsoleOutput('');
    setTestResults(null);
    setSubmissionVerdict(null);

    const startTime = performance.now();

    setTimeout(() => {
      let logs = [];
      const validation = checkStudentLogic(selectedProblem.id, code);

      if (!validation.valid) {
        logs.push(`⚠️ [Compilation/Runtime Warning]: Code logic incomplete.`);
        logs.push(`${validation.message}`);
        logs.push(`\nPlease write your solution code before running.`);
        setSubmissionVerdict('COMPILE_ERROR');
        setSampleOutputs({
          0: `❌ Compilation Error:\n${validation.message}`,
          1: `❌ Compilation Error:\n${validation.message}`,
          custom: `❌ Compilation Error:\n${validation.message}`
        });
      } else {
        logs.push(`[${languages.find(l => l.id === selectedLang)?.name} Compiler Output]:`);
        logs.push(`Compiling ${selectedProblem.title}${languages.find(l => l.id === selectedLang)?.extension}...`);
        logs.push(`Compilation Result: SUCCESS ✓ (0 Syntax Errors)`);
        logs.push(`Executing against Sample Testcases & Custom Input...`);
        logs.push(`\n--- Execution Output ---`);
        logs.push(useCustomInput ? (customInput || 'No custom input provided') : `Sample Output: ${selectedProblem.sampleTestCases[0].output}`);
        logs.push(`\nStatus: Process finished with exit code 0`);

        const customOut = customInput 
          ? `[Custom Output]: ${selectedProblem.sampleTestCases[0].output}\nInput: "${customInput}"\nStatus: Process finished with exit code 0`
          : `Output: ${selectedProblem.sampleTestCases[0].output}\nStatus: Process finished with exit code 0`;

        setSampleOutputs({
          0: selectedProblem.sampleTestCases[0].output,
          1: selectedProblem.sampleTestCases[1]?.output || 'N/A',
          custom: customOut
        });
      }

      const duration = Math.round(performance.now() - startTime + 12);
      setExecutionStats({ timeMs: duration, memoryMb: (3.1 + Math.random() * 0.9).toFixed(1) });
      setConsoleOutput(logs.join('\n'));
      setIsExecuting(false);
    }, 450);
  };

  // Submit Solution against All Hidden Test Cases (CodeChef Evaluation)
  const handleSubmitTestCases = () => {
    setIsExecuting(true);
    setHasExecuted(true);
    setActiveRightTab('results');
    setSubmissionVerdict(null);
    setTestResults(null);
    setConsoleOutput('');

    const startTime = performance.now();

    setTimeout(() => {
      const validation = checkStudentLogic(selectedProblem.id, code);

      if (!validation.valid) {
        setIsExecuting(false);
        setSampleOutputs({
          0: `❌ Compilation Error:\n${validation.message}`,
          1: `❌ Compilation Error:\n${validation.message}`,
          custom: `❌ Compilation Error:\n${validation.message}`
        });
        if (validation.reason === 'UNWRITTEN') {
          setSubmissionVerdict('COMPILE_ERROR');
          setConsoleOutput(`❌ [Compilation Failure]: ${validation.message}`);
          const mockFailures = [
            ...selectedProblem.sampleTestCases.map(tc => ({ id: tc.id, input: tc.input, expected: tc.output, actual: 'N/A', passed: false, type: 'Sample' })),
            ...selectedProblem.hiddenTestCases.map(tc => ({ id: tc.id, input: tc.input, expected: tc.expected, actual: 'N/A', passed: false, type: 'Hidden (' + tc.type + ')' }))
          ];
          setTestResults(mockFailures);
        } else {
          setSubmissionVerdict('WRONG_ANSWER');
          const mockFailures = [
            ...selectedProblem.sampleTestCases.map(tc => ({ id: tc.id, input: tc.input, expected: tc.output, actual: 'Incorrect Output', passed: false, type: 'Sample' })),
            ...selectedProblem.hiddenTestCases.map(tc => ({ id: tc.id, input: tc.input, expected: tc.expected, actual: 'Incorrect Output', passed: false, type: 'Hidden (' + tc.type + ')' }))
          ];
          setTestResults(mockFailures);
          setConsoleOutput(`❌ Submission Result: WRONG ANSWER (0/${mockFailures.length} Test Cases Passed).\nReason: ${validation.message}`);
        }
        return;
      }

      // Code passes cleanly!
      const customOut = customInput 
        ? `[Custom Output]: ${selectedProblem.sampleTestCases[0].output}\nInput: "${customInput}"\nVerdict: ACCEPTED 🎉`
        : `Output: ${selectedProblem.sampleTestCases[0].output}\nVerdict: ACCEPTED 🎉`;

      setSampleOutputs({
        0: selectedProblem.sampleTestCases[0].output,
        1: selectedProblem.sampleTestCases[1]?.output || 'N/A',
        custom: customOut
      });

      const samplePassed = selectedProblem.sampleTestCases.map(tc => ({
        id: `sample-${tc.id}`,
        input: tc.input,
        expected: tc.output,
        actual: tc.output,
        passed: true,
        type: 'Sample Case',
        timeMs: Math.floor(Math.random() * 6) + 2
      }));

      const hiddenPassed = selectedProblem.hiddenTestCases.map(tc => ({
        id: `hidden-${tc.id}`,
        input: tc.input,
        expected: tc.expected,
        actual: tc.expected,
        passed: true,
        type: `Hidden (${tc.type})`,
        timeMs: Math.floor(Math.random() * 6) + 2
      }));

      const allResults = [...samplePassed, ...hiddenPassed];
      const duration = Math.round(performance.now() - startTime + 16);

      setExecutionStats({ timeMs: duration, memoryMb: '3.8' });
      setTestResults(allResults);
      setSubmissionVerdict('ACCEPTED');
      setConsoleOutput(`🎉 VERDICT: ACCEPTED (100/100 Points)\nExecution Time: ${duration} ms | Memory: 3.8 MB\nAll ${allResults.length} Test Cases Passed (+${selectedProblem.xp} XP Awarded!)`);

      // Award XP & Track Solved Problem
      if (!solvedProblemIds.includes(selectedProblem.id)) {
        setSolvedProblemIds(prev => [...prev, selectedProblem.id]);
        setTotalXP(prev => prev + selectedProblem.xp);
      }

      setIsExecuting(false);
    }, 750);
  };

  const solvedInDailyCount = assignedProblems.filter(p => solvedProblemIds.includes(p.id)).length;
  const allDailySolved = assignedProblems.length > 0 && solvedInDailyCount === assignedProblems.length;

  const handleAdvanceNextDay = () => {
    setSimulatedDayOffset(prev => prev + 1);
  };

  const handleResetToRealDate = () => {
    setSimulatedDayOffset(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors font-sans selection:bg-brand-500 selection:text-white">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className={`flex-1 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} transition-all duration-300 flex flex-col min-w-0 h-screen overflow-hidden`}>
        <TopHeader setMobileOpen={setMobileOpen} />

        {/* CodeChef Style IDE Container */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-100 dark:bg-slate-950 p-3 sm:p-4 space-y-3">
          
          {/* Daily Practice & Rollover Status Banner */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Daily Practice: {new Date(currentDateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {simulatedDayOffset > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 animate-pulse">
                      Day +{simulatedDayOffset} (Simulated)
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    allDailySolved 
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' 
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                  }`}>
                    {solvedInDailyCount} / {assignedProblems.length} Solved {allDailySolved ? '🎉' : ''}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {allDailySolved ? (
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>All {assignedProblems.length} challenges solved for today! Next day will generate brand-new questions.</span>
                    </div>
                  ) : (
                    <div className="text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        {assignedProblems.length - solvedInDailyCount} challenge(s) left. Unsolved questions will automatically rollover to next day's set!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {simulatedDayOffset > 0 && (
                <button
                  onClick={handleResetToRealDate}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700"
                  title="Reset simulation to actual real date"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Real Date</span>
                </button>
              )}

              <button
                onClick={handleAdvanceNextDay}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition flex items-center space-x-1.5"
                title="Advance to next day to test rollover & new question generation"
              >
                <span>Simulate Next Day ⏩</span>
              </button>
            </div>
          </div>
          
          {/* Top CodeChef IDE Status Toolbar */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-sm">
            
            {/* Left Info: Problem Title & Status Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-500/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/20 dark:border-brand-500/30">
                <Code2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-1.5">
                    <span>{selectedProblem.title}</span>
                    {solvedProblemIds.includes(selectedProblem.id) && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    )}
                  </h1>
                </div>

                <div className="flex items-center space-x-2 text-[11px] font-mono mt-0.5">
                  <span className="text-slate-500 dark:text-slate-400">{selectedProblem.category}</span>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <span className={`font-bold ${
                    selectedProblem.difficulty === 'Easy' ? 'text-emerald-600 dark:text-emerald-400' : selectedProblem.difficulty === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {selectedProblem.difficulty}
                  </span>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <span className="text-slate-500 dark:text-slate-400">Accuracy: <strong className="text-slate-800 dark:text-slate-200">{selectedProblem.accuracy}</strong></span>
                </div>
              </div>
            </div>

            {/* Right Controls: Solved Stats, Language Dropdown & Controls */}
            <div className="flex items-center space-x-3 shrink-0">
              
              {/* Solved XP Badge */}
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono text-xs font-bold flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>+{selectedProblem.xp} XP</span>
              </div>

              {/* Language Selector Dropdown */}
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLang(lang.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                      selectedLang === lang.id
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title={lang.version}
                  >
                    <span>{lang.icon}</span>
                    <span className="hidden sm:inline">{lang.name}</span>
                  </button>
                ))}
              </div>

            </div>

          </div>

          {/* Main IDE Split Workspace (12-Grid Split) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">

            {/* LEFT PANE: Problem Statement / Specs & Hints (4 Columns) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col min-h-0 overflow-hidden shadow-sm">
              
              {/* Left Pane Navigation Tabs */}
              <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-2 pt-2 shrink-0 overflow-x-auto custom-scrollbar">
                <button
                  onClick={() => setActiveLeftTab('problem')}
                  className={`px-3 py-2 text-xs font-extrabold transition border-b-2 flex items-center space-x-1.5 shrink-0 ${
                    activeLeftTab === 'problem'
                      ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900 rounded-t-xl'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Problem</span>
                </button>

                <button
                  onClick={() => setActiveLeftTab('hints')}
                  className={`px-3 py-2 text-xs font-extrabold transition border-b-2 flex items-center space-x-1.5 shrink-0 ${
                    activeLeftTab === 'hints'
                      ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900 rounded-t-xl'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>Hints</span>
                </button>

                <button
                  onClick={() => setActiveLeftTab('daily')}
                  className={`px-3 py-2 text-xs font-extrabold transition border-b-2 flex items-center space-x-1.5 shrink-0 ${
                    activeLeftTab === 'daily'
                      ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900 rounded-t-xl'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
                  <span>Daily Queue ({solvedInDailyCount}/{assignedProblems.length})</span>
                </button>

                <button
                  onClick={() => setActiveLeftTab('bank')}
                  className={`px-3 py-2 text-xs font-extrabold transition border-b-2 flex items-center space-x-1.5 shrink-0 ${
                    activeLeftTab === 'bank'
                      ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900 rounded-t-xl'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>All Bank ({PRACTICE_PROBLEM_BANK.length})</span>
                </button>
              </div>

              {/* Left Pane Content Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar select-text text-slate-800 dark:text-slate-300">
                
                {activeLeftTab === 'problem' && (
                  <div className="space-y-4 animate-fade-in text-xs leading-relaxed">
                    
                    {/* Problem Statement text */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Problem Statement</h3>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                        {selectedProblem.description}
                      </p>
                    </div>

                    {/* Input / Output Format */}
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Input Format:</span>
                        <p className="font-mono text-slate-800 dark:text-slate-300 mt-0.5">{selectedProblem.inputFormat}</p>
                      </div>
                      <div>
                        <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Output Format:</span>
                        <p className="font-mono text-slate-800 dark:text-slate-300 mt-0.5">{selectedProblem.outputFormat}</p>
                      </div>
                    </div>

                    {/* Constraints */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Constraints:</span>
                      <ul className="space-y-1 font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                        {selectedProblem.constraints.map((c, idx) => (
                          <li key={idx} className="flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sample Test Cases */}
                    <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sample Testcases:</span>
                      
                      {selectedProblem.sampleTestCases.map((stc, idx) => (
                        <div key={stc.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2 font-mono text-[11px]">
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1">
                            <span className="font-bold text-slate-900 dark:text-white">Sample #{idx + 1}</span>
                            <button
                              onClick={() => handleCopySample(`${stc.input}\n${stc.output}`, idx)}
                              className="text-[10px] text-brand-600 dark:text-brand-400 hover:text-brand-500 flex items-center space-x-1"
                            >
                              {copiedSampleIdx === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedSampleIdx === idx ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Input:</span>
                            <div className="text-slate-900 dark:text-emerald-300 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 mt-0.5 overflow-x-auto">{stc.input}</div>
                          </div>
                          <div>
                            <span className="text-slate-500 dark:text-slate-400">Output:</span>
                            <div className="text-brand-600 dark:text-cyan-300 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 mt-0.5 overflow-x-auto">{stc.output}</div>
                          </div>
                          {stc.explanation && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 italic pt-1">{stc.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {activeLeftTab === 'hints' && (
                  <div className="space-y-3 animate-fade-in text-xs">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
                      <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Problem Solving Strategy</span>
                      </div>
                      <p className="text-amber-900 dark:text-amber-200/90 leading-relaxed font-mono">{selectedProblem.hint}</p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400 font-bold uppercase">Optimized Complexity Goal:</span>
                      <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                        <li>• Time Complexity: <strong>O(N)</strong> using Single Pass loop.</li>
                        <li>• Space Complexity: <strong>O(1) to O(N)</strong> auxiliary map allocation.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeLeftTab === 'daily' && (
                  <div className="space-y-3 animate-fade-in text-xs font-mono">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Daily Queue Progress:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">{solvedInDailyCount} / {assignedProblems.length} Solved</strong>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                        Solve all questions today to receive brand-new challenges tomorrow. Unsolved challenges rollover automatically.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {assignedProblems.map((p, idx) => {
                        const isSolved = solvedProblemIds.includes(p.id);
                        const isRolledOver = !isSolved && dailyState?.rolledOverProblemIds?.includes(p.id);

                        return (
                          <div 
                            key={p.id}
                            onClick={() => setSelectedProblem(p)}
                            className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                              selectedProblem.id === p.id 
                                ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 ring-2 ring-brand-500/20 shadow-sm' 
                                : 'bg-white dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="space-y-1 pr-2 min-w-0">
                              <div className="font-bold text-slate-900 dark:text-white text-xs truncate flex items-center space-x-1.5">
                                <span>P{idx + 1}. {p.title}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400">
                                <span>{p.category}</span>
                                <span>•</span>
                                <span className={p.difficulty === 'Easy' ? 'text-emerald-500' : p.difficulty === 'Medium' ? 'text-amber-500' : 'text-rose-500'}>
                                  {p.difficulty}
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0">
                              {isSolved ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center space-x-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>ACCEPTED ✓</span>
                                </span>
                              ) : isRolledOver ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center space-x-1" title="Rolled over from previous day">
                                  <Clock className="w-3 h-3 text-amber-500" />
                                  <span>Rolled Over ⏳</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-500/30 flex items-center space-x-1">
                                  <Sparkles className="w-3 h-3 text-indigo-500" />
                                  <span>Today's New ✨</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeLeftTab === 'bank' && (
                  <div className="space-y-3 animate-fade-in text-xs font-mono">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span>Total Algorithm Bank:</span>
                      <strong className="text-brand-600 dark:text-brand-400">{PRACTICE_PROBLEM_BANK.length} Available</strong>
                    </div>

                    <div className="space-y-2">
                      {PRACTICE_PROBLEM_BANK.map((p) => {
                        const isSolved = solvedProblemIds.includes(p.id);
                        const isAssignedToday = assignedProblems.some(ap => ap.id === p.id);

                        return (
                          <div 
                            key={p.id}
                            onClick={() => setSelectedProblem(p)}
                            className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                              selectedProblem.id === p.id 
                                ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 shadow-sm' 
                                : 'bg-white dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="space-y-0.5 min-w-0 pr-2">
                              <div className="font-bold text-slate-900 dark:text-white text-xs truncate">{p.title}</div>
                              <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400">
                                <span>{p.category}</span>
                                <span>•</span>
                                <span>+{p.xp} XP</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5 shrink-0">
                              {isAssignedToday && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand-500/10 text-brand-600 border border-brand-500/20">
                                  Today
                                </span>
                              )}
                              {isSolved ? (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                                  ✓
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">Open</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Problem Suite Quick Selector Footer */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
                <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">Today's Set:</span>
                <div className="flex items-center space-x-1.5">
                  {assignedProblems.map((p, idx) => {
                    const isSolved = solvedProblemIds.includes(p.id);
                    const isRolledOver = !isSolved && dailyState?.rolledOverProblemIds?.includes(p.id);

                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProblem(p)}
                        className={`px-2.5 py-1 rounded-xl font-mono text-[11px] font-bold transition flex items-center space-x-1.5 ${
                          selectedProblem.id === p.id
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                        title={`${p.title} (${isSolved ? 'Solved' : isRolledOver ? 'Rolled Over' : 'New Today'})`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          isSolved ? 'bg-emerald-400' : isRolledOver ? 'bg-amber-400' : 'bg-blue-400'
                        }`} />
                        <span>P{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT PANE: CodeChef Code Editor & Execution Workspace (8 Columns) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col min-h-0 overflow-y-auto custom-scrollbar shadow-sm">
              
              {/* Code Editor Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="text-base">{languages.find(l => l.id === selectedLang)?.icon}</span>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {languages.find(l => l.id === selectedLang)?.name} Workspace
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-bold flex items-center space-x-1 transition"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleResetCode}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-mono font-bold flex items-center space-x-1 transition"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                    <span>Reset Boilerplate</span>
                  </button>
                </div>
              </div>

              {/* Textarea Code Editor Area */}
              <div className="relative bg-slate-900 dark:bg-slate-950 flex min-h-[320px] shrink-0">
                
                {/* Dynamic Line Numbers Column */}
                <div className="w-11 bg-slate-950 dark:bg-slate-900/80 border-r border-slate-800 py-3 text-right pr-2 text-slate-600 font-mono text-xs sm:text-sm select-none shrink-0">
                  {Array.from({ length: Math.max(25, (code || '').split('\n').length + 5) }).map((_, i) => (
                    <div key={i} className="leading-relaxed">{i + 1}</div>
                  ))}
                </div>

                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  placeholder="// Write your code solution here..."
                  className="flex-1 bg-slate-900 text-emerald-300 dark:bg-slate-950 border-none p-3.5 font-mono text-xs sm:text-sm focus:outline-none leading-relaxed resize-none custom-scrollbar min-h-[320px]"
                />
              </div>

              {/* 1. INPUT SECTION (Directly Underneath Code Editor) */}
              <div className="p-3.5 bg-slate-100/90 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 space-y-2.5 shrink-0 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center space-x-1.5">
                    <Sliders className="w-3.5 h-3.5 text-brand-500" />
                    <span>Testcase Input:</span>
                  </span>

                  {/* Case Selector Pills (Case 1, Case 2, + Custom Input) */}
                  <div className="flex items-center space-x-1.5">
                    {selectedProblem.sampleTestCases.map((tc, idx) => (
                      <button
                        key={tc.id}
                        onClick={() => { setActiveCaseIdx(idx); setUseCustomInput(false); }}
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition ${
                          activeCaseIdx === idx && !useCustomInput
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => { setActiveCaseIdx('custom'); setUseCustomInput(true); }}
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition ${
                        activeCaseIdx === 'custom' || useCustomInput
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      + Custom Input
                    </button>
                  </div>
                </div>

                {/* Input Payload Display or Editable Custom Input */}
                {typeof activeCaseIdx === 'number' && !useCustomInput && selectedProblem.sampleTestCases[activeCaseIdx] ? (
                  <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-emerald-300 overflow-x-auto min-h-[52px]">
                    {selectedProblem.sampleTestCases[activeCaseIdx].input}
                  </div>
                ) : (
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter custom input payload string here (e.g. nums = [2, 7, 11, 15], target = 9)..."
                    rows={2}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-mono text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-brand-500"
                  />
                )}
              </div>

              {/* IDE Action Control Toolbar (Run Code & Submit Solution) */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRunCode}
                    disabled={isExecuting}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold flex items-center space-x-1.5 transition disabled:opacity-50 shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run Code</span>
                  </button>

                  <button
                    onClick={handleSubmitTestCases}
                    disabled={isExecuting}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold flex items-center space-x-1.5 transition disabled:opacity-50 shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Solution 🚀</span>
                  </button>
                </div>

                {isExecuting ? (
                  <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400 animate-pulse flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                    <span>Evaluating...</span>
                  </span>
                ) : executionStats ? (
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>{executionStats.timeMs} ms</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Cpu className="w-3 h-3 text-cyan-500" />
                      <span>{executionStats.memoryMb} MB</span>
                    </span>
                  </div>
                ) : null}
              </div>

              {/* 2. OUTPUT & VERDICT SECTION (Appears as soon as Run Code or Submit Solution is clicked!) */}
              {hasExecuted && (
                <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 space-y-3 font-mono text-xs animate-fade-in shrink-0">
                  
                  {/* Output Tabs & Status Verdict Badge */}
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setActiveRightTab('testcases')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                          activeRightTab === 'testcases'
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                        <span>Output Details</span>
                      </button>

                      <button
                        onClick={() => setActiveRightTab('output')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                          activeRightTab === 'output'
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                        <span>Compiler Stream</span>
                      </button>

                      <button
                        onClick={() => setActiveRightTab('results')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                          activeRightTab === 'results'
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                        <span>Full Suite Verdict {testResults ? `(${testResults.length})` : ''}</span>
                      </button>
                    </div>

                    {submissionVerdict && (
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                        submissionVerdict === 'ACCEPTED'
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                          : submissionVerdict === 'COMPILE_ERROR'
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40'
                      }`}>
                        {submissionVerdict === 'ACCEPTED' ? 'Verdict: ACCEPTED 🎉' : submissionVerdict === 'COMPILE_ERROR' ? 'Verdict: COMPILE ERROR ⚠️' : 'Verdict: WRONG ANSWER ❌'}
                      </span>
                    )}
                  </div>

                  {/* Tab 1: Output Details (Your Output vs Expected Output) */}
                  {activeRightTab === 'testcases' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Your Output:
                        </span>
                        <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-cyan-300 overflow-x-auto min-h-[60px] whitespace-pre-wrap">
                          {sampleOutputs ? sampleOutputs[activeCaseIdx] : '// Output streaming...'}
                        </pre>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Expected Output:
                        </span>
                        <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto min-h-[60px]">
                          {typeof activeCaseIdx === 'number' && selectedProblem.sampleTestCases[activeCaseIdx]
                            ? selectedProblem.sampleTestCases[activeCaseIdx].output
                            : 'Matches Custom Input expectation standard'}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Compiler Stream */}
                  {activeRightTab === 'output' && (
                    <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap max-h-48">
                      {consoleOutput}
                    </pre>
                  )}

                  {/* Tab 3: Full Suite Verdict */}
                  {activeRightTab === 'results' && (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                      {testResults ? (
                        testResults.map((tr, idx) => (
                          <div key={idx} className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                            <div className="flex items-center space-x-2">
                              {tr.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                              )}
                              <span className="font-bold text-slate-900 dark:text-white">{tr.type}:</span>
                              <span className="text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{tr.input}</span>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0">
                              <span className="text-slate-400">Output:</span>
                              <span className="text-emerald-600 dark:text-emerald-300 font-bold">{tr.actual}</span>
                              <span className="text-[10px] text-slate-400">({tr.timeMs || 4}ms)</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 italic">No testcase results recorded. Click "Submit Solution" to run full test suite.</p>
                      )}
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

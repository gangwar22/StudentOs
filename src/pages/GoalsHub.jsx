import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { EmptyState } from '../components/common/EmptyState';
import { useLearning } from '../context/LearningContext';
import { generateNVidiaGoals } from '../services/nvidiaVoiceMentorService';
import { curriculumPhases } from '../data/curriculumPhases';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  RotateCw, 
  Calendar, 
  Mic, 
  Sparkles, 
  Clock, 
  Cpu,
  RefreshCw,
  Brain
} from 'lucide-react';

export function GoalsHub() {
  const { 
    dailyGoals,
    addDailyGoal,
    updateGoalProgress,
    toggleGoalComplete,
    deleteDailyGoal,
    forceRolloverNextDay,
    syncActivePhaseAgenda,
    weeklyGoals,
    addWeeklyGoal,
    updateWeeklyGoalProgress,
    toggleWeeklyGoalComplete,
    deleteWeeklyGoal,
    monthlyGoals,
    addMonthlyGoal,
    updateMonthlyGoalProgress,
    toggleMonthlyGoalComplete,
    deleteMonthlyGoal,
    getActivePhaseDetails,
    getPhaseDeadline,
    getPhaseDaysSpent,
    getActivePhaseNumber,
    sidebarCollapsed,
    simulatedLoading, 
    simulatedError, 
    simulatedEmpty, 
    setSimulatedError, 
    setSimulatedEmpty 
  } = useLearning();

  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [goalScopeFilter, setGoalScopeFilter] = useState('daily'); // 'daily' | 'weekly' | 'monthly'

  // Manual goal input
  const [newGoalTitle, setNewGoalTitle] = useState('');

  // AI Goal Generator drawer toggle
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [isGeneratingGoals, setIsGeneratingGoals] = useState(false);
  const [aiGeneratedGoals, setAiGeneratedGoals] = useState([]);

  const activePhase = getActivePhaseDetails();
  const activePhaseNum = getActivePhaseNumber();
  const deadlineDays = getPhaseDeadline(activePhaseNum);
  const daysSpent = getPhaseDaysSpent(activePhaseNum);
  const currPhaseObj = curriculumPhases.find(p => p.phaseNumber === activePhaseNum);

  // Generate AI Goals strictly bounded within active phase
  const handleGenerateAiGoals = async () => {
    setIsGeneratingGoals(true);
    setAiGeneratedGoals([]);
    try {
      const generated = await generateNVidiaGoals({
        scope: goalScopeFilter,
        activePhaseTitle: activePhase.title,
        activePhaseNumber: activePhaseNum,
        phaseTopics: currPhaseObj?.pageBreakdown?.map(p => p.title) || [],
        miniProjects: currPhaseObj?.miniProjects || [],
        targetRole: 'Full Stack MERN Developer',
        deadlineDays
      });
      setAiGeneratedGoals(generated);
    } catch (err) {
      console.error('Error generating AI goals:', err);
    } finally {
      setIsGeneratingGoals(false);
    }
  };

  const handleAddAiGoal = (title) => {
    if (goalScopeFilter === 'weekly') addWeeklyGoal(title);
    else if (goalScopeFilter === 'monthly') addMonthlyGoal(title);
    else addDailyGoal(title);

    setAiGeneratedGoals(prev => prev.filter(g => g !== title));
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    if (goalScopeFilter === 'weekly') addWeeklyGoal(newGoalTitle);
    else if (goalScopeFilter === 'monthly') addMonthlyGoal(newGoalTitle);
    else addDailyGoal(newGoalTitle);

    setNewGoalTitle('');
  };

  const currentGoalsList = goalScopeFilter === 'weekly' 
    ? weeklyGoals 
    : goalScopeFilter === 'monthly' 
    ? monthlyGoals 
    : dailyGoals;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className={`flex-1 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} transition-all duration-300 flex flex-col min-w-0`}>
        <TopHeader setMobileOpen={setMobileOpen} />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6 max-w-6xl mx-auto w-full">


          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                <Target className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                <span>Goals & Agenda Hub</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Write your custom goals or click "Suggest Goals with AI" for smart phase-aligned recommendations!
              </p>
            </div>

            <button
              onClick={() => navigate('/reflections/live')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-2 shrink-0 self-start sm:self-auto"
            >
              <Mic className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>Go for Day's Reflection 🎙️</span>
            </button>
          </div>

          {/* Active Phase Agenda & Deadline Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-indigo-800/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="px-3 py-1 rounded-full bg-brand-500/30 text-brand-300 border border-brand-400/40 text-[11px] font-extrabold uppercase tracking-wider">
                  Active Phase Agenda
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-mono font-bold">
                  Day {daysSpent} of {deadlineDays} Days Deadline ⏳
                </span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-400" />
                <span>{activePhase.title}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your daily agenda items are automatically bounded within your current phase. Complete these items to stay on track for phase completion before your {deadlineDays}-day deadline!
              </p>
            </div>

            <button
              onClick={syncActivePhaseAgenda}
              className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-lg transition flex items-center space-x-2 shrink-0 self-start md:self-auto border border-brand-400/40"
            >
              <RefreshCw className="w-4 h-4 text-cyan-300" />
              <span>Sync Active Phase Agenda 🔄</span>
            </button>
          </div>

          {/* Data State Conditional Display */}
          {simulatedLoading ? (
            <LoadingSpinner text="Fetching goal records..." />
          ) : simulatedError ? (
            <ErrorAlert 
              title="Failed to load goals"
              message="Simulated error flag is active. Click below to clear error state."
              onRetry={() => setSimulatedError(false)}
            />
          ) : simulatedEmpty ? (
            <EmptyState 
              title="No Goals Found"
              description="Add a new goal to start tracking!"
              actionText="Reset Goals Tracker"
              onAction={() => setSimulatedEmpty(false)}
            />
          ) : (
            <div className="space-y-6 animate-fade-in">

              {/* Clean Filter Bar & Action Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Clean Filter Dropdown Pills */}
                  <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    {[
                      { id: 'daily', label: 'Daily Goals', count: dailyGoals.length, icon: Clock },
                      { id: 'weekly', label: 'Weekly Goals', count: weeklyGoals.length, icon: Calendar },
                      { id: 'monthly', label: 'Monthly Goals', count: monthlyGoals.length, icon: Target }
                    ].map(scope => {
                      const IconComp = scope.icon;
                      const isSelected = goalScopeFilter === scope.id;
                      return (
                        <button
                          key={scope.id}
                          onClick={() => setGoalScopeFilter(scope.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                            isSelected
                              ? 'bg-brand-600 text-white shadow-md'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                          <span>{scope.label}</span>
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>
                            {scope.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* AI Goal Generator Toggle Button */}
                  <button
                    onClick={() => {
                      setShowAiGenerator(!showAiGenerator);
                      if (!showAiGenerator && aiGeneratedGoals.length === 0) {
                        handleGenerateAiGoals();
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center space-x-1.5 transition shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{showAiGenerator ? 'Hide AI Generator' : 'Generate Goals with NVIDIA AI ✨'}</span>
                  </button>

                </div>

                {/* Collapsible NVIDIA AI Goals Generator */}
                {showAiGenerator && (
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/80 dark:from-indigo-950/50 to-slate-50 dark:to-slate-950 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          NVIDIA AI Goal Suggestions for {goalScopeFilter.toUpperCase()} Scope:
                        </h4>
                      </div>

                      <button
                        onClick={handleGenerateAiGoals}
                        disabled={isGeneratingGoals}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${isGeneratingGoals ? 'animate-spin' : ''}`} />
                        <span>Regenerate</span>
                      </button>
                    </div>

                    {isGeneratingGoals ? (
                      <div className="p-4 text-center text-xs text-indigo-600 dark:text-indigo-300 font-medium space-y-1">
                        <p>Analyzing curriculum phase & generating tailored goals...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {aiGeneratedGoals.map((title, idx) => (
                          <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                              {title}
                            </p>
                            <button
                              onClick={() => handleAddAiGoal(title)}
                              className="w-full py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800 transition flex items-center justify-center space-x-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Goal</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Input Form */}
                <form onSubmit={handleManualAdd} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    placeholder={`Type a new ${goalScopeFilter} goal...`}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition"
                  />
                  <button
                    type="submit"
                    disabled={!newGoalTitle.trim()}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 disabled:opacity-40 hover:bg-brand-500 text-white font-bold text-xs flex items-center space-x-1 transition shadow-md shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Goal</span>
                  </button>
                </form>

                {/* Rollover Test trigger for Daily Scope */}
                {goalScopeFilter === 'daily' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={forceRolloverNextDay}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-[11px] font-semibold flex items-center space-x-1 transition"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Simulate Next-Day Rollover ⏩</span>
                    </button>
                  </div>
                )}

              </div>

              {/* GOALS LIST DISPLAY */}
              <div className="space-y-3">
                {currentGoalsList.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center text-xs text-slate-500 italic border border-slate-200 dark:border-slate-800">
                    No {goalScopeFilter} goals added yet. Type one above or click "Generate Goals with NVIDIA AI"!
                  </div>
                ) : (
                  currentGoalsList.map(goal => (
                    <div
                      key={goal.id}
                      className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        goal.completed
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                          : goal.rolledOverFrom
                          ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={goal.completed}
                          onChange={() => {
                            if (goalScopeFilter === 'weekly') toggleWeeklyGoalComplete(goal.id);
                            else if (goalScopeFilter === 'monthly') toggleMonthlyGoalComplete(goal.id);
                            else toggleGoalComplete(goal.id);
                          }}
                          className="w-5 h-5 rounded-md border-slate-300 text-brand-600 focus:ring-brand-500 mt-0.5 cursor-pointer"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <h4 className={`text-xs sm:text-sm font-bold ${goal.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                              {goal.title}
                            </h4>
                            {goal.rolledOverFrom && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                🔄 Carried Over from {goal.rolledOverFrom}
                              </span>
                            )}
                            {goal.completed && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                Completed 100% ✓
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-3 pt-1">
                            <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden max-w-xs">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  goal.completed ? 'bg-emerald-500' : 'bg-brand-500'
                                }`}
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 font-mono">
                              {goal.progress}% Done
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              if (goalScopeFilter === 'weekly') updateWeeklyGoalProgress(goal.id, 50);
                              else if (goalScopeFilter === 'monthly') updateMonthlyGoalProgress(goal.id, 50);
                              else updateGoalProgress(goal.id, 50);
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-mono rounded text-slate-700 dark:text-slate-300"
                          >
                            50%
                          </button>
                          <button
                            onClick={() => {
                              if (goalScopeFilter === 'weekly') updateWeeklyGoalProgress(goal.id, 100);
                              else if (goalScopeFilter === 'monthly') updateMonthlyGoalProgress(goal.id, 100);
                              else updateGoalProgress(goal.id, 100);
                            }}
                            className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 text-[10px] font-mono rounded text-emerald-800 dark:text-emerald-300 font-bold"
                          >
                            100%
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            if (goalScopeFilter === 'weekly') deleteWeeklyGoal(goal.id);
                            else if (goalScopeFilter === 'monthly') deleteMonthlyGoal(goal.id);
                            else deleteDailyGoal(goal.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Delete goal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

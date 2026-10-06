import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, CheckCircle2, ArrowRight, ArrowLeft, Target, Clock, Code, Award, Sparkles } from 'lucide-react';

export function Onboarding() {
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [finishError, setFinishError] = useState('');
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    primaryGoal: 'Become a Job-Ready Full Stack Developer',
    currentLevel: 'Beginner / Self-Taught',
    weeklyHours: '15-20 Hours / Week (Fast Pace)',
    starterStack: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB']
  });

  const goals = [
    { id: 'job', title: 'Become a Job-Ready Developer', desc: 'Prepare for full-time software engineering roles and pass technical interviews.' },
    { id: 'projects', title: 'Build Full-Stack SaaS Apps', desc: 'Master MERN stack to launch your own products and web applications.' },
    { id: 'upskill', title: 'Upskill Current Engineering Skills', desc: 'Deep dive into modern React 18, Node streams, and MongoDB aggregations.' }
  ];

  const levels = [
    { id: 'beginner', title: 'Beginner / Self-Taught', desc: 'Familiar with basic HTML & CSS, looking for structured full-stack guidance.' },
    { id: 'intermediate', title: 'Intermediate Coding', desc: 'Can write JavaScript and React components, ready for backend Node & MongoDB.' },
    { id: 'advanced', title: 'Advanced Developer', desc: 'Looking for complex architecture, system design, and performance optimizations.' }
  ];

  const hours = [
    { id: 'casual', title: '5-10 Hours / Week', desc: 'Steady learning schedule alongside work or school.' },
    { id: 'balanced', title: '10-15 Hours / Week', desc: 'Accelerated pace with weekly hands-on project milestones.' },
    { id: 'intensive', title: '15-20+ Hours / Week', desc: 'Full immersion bootcamp-style dedication.' }
  ];

  const handleFinish = async () => {
    setSaving(true);
    setFinishError('');
    try {
      await completeOnboarding(preferences);
      navigate('/dashboard');
    } catch (error) {
      setFinishError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-4 relative z-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-brand-500 dark:text-brand-400" />
          <span>Step {step} of 4 — Workspace Initialization</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Customize Your StudentOS Experience</h2>
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-2 pt-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? 'w-10 bg-brand-500' : s < step ? 'w-4 bg-brand-600' : 'w-4 bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          
          {/* Step 1: Goal */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Target className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                <span>What is your primary learning goal?</span>
              </h3>
              <div className="space-y-3">
                {goals.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setPreferences({ ...preferences, primaryGoal: g.title })}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      preferences.primaryGoal === g.title
                        ? 'bg-brand-50/80 dark:bg-brand-950/60 border-brand-500 shadow-md shadow-brand-500/10'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{g.title}</h4>
                      {preferences.primaryGoal === g.title && <CheckCircle2 className="w-5 h-5 text-brand-500 dark:text-brand-400" />}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{g.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Skill Level */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                <span>Where are you currently starting from?</span>
              </h3>
              <div className="space-y-3">
                {levels.map((lvl) => (
                  <div
                    key={lvl.id}
                    onClick={() => setPreferences({ ...preferences, currentLevel: lvl.title })}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      preferences.currentLevel === lvl.title
                        ? 'bg-brand-50/80 dark:bg-brand-950/60 border-brand-500 shadow-md shadow-brand-500/10'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{lvl.title}</h4>
                      {preferences.currentLevel === lvl.title && <CheckCircle2 className="w-5 h-5 text-brand-500 dark:text-brand-400" />}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{lvl.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                <span>How much time can you commit each week?</span>
              </h3>
              <div className="space-y-3">
                {hours.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => setPreferences({ ...preferences, weeklyHours: h.title })}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      preferences.weeklyHours === h.title
                        ? 'bg-brand-50/80 dark:bg-brand-950/60 border-brand-500 shadow-md shadow-brand-500/10'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{h.title}</h4>
                      {preferences.weeklyHours === h.title && <CheckCircle2 className="w-5 h-5 text-brand-500 dark:text-brand-400" />}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{h.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Confirm Starter Stack */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Code className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                <span>Your Pre-Loaded Full-Stack Curriculum</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                StudentOS will initialize your workspace with full interactive Coursera-style courses for the following stack:
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {preferences.starterStack.map((tech, i) => (
                  <div key={i} className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-300">{tech}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Your workspace settings, streak trackers, and learning paths are ready!</span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            {finishError && <p role="alert" className="mr-4 text-sm text-rose-600 dark:text-rose-400">{finishError}</p>}
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center space-x-1 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 shadow-lg shadow-brand-500/20 transition"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-xl shadow-brand-500/25 transition disabled:opacity-60"
              >
                <span>{saving ? 'Saving preferences…' : 'Launch My Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

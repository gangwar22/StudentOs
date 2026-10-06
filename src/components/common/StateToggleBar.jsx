import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';

export function StateToggleBar({ pageName = "page" }) {
  const { 
    simulatedLoading, 
    simulatedError, 
    simulatedEmpty,
    triggerStateSimulation,
    setSimulatedError,
    setSimulatedEmpty
  } = useLearning();

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300 shadow-md">
      <div className="flex items-center space-x-2 font-medium">
        <span className="inline-block w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
        <span className="text-slate-500 dark:text-slate-400">Interactive QA Tools:</span>
        <span className="text-slate-900 dark:text-white font-semibold capitalize">{pageName} Data States</span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => triggerStateSimulation('loading')}
          disabled={simulatedLoading}
          className={`px-3 py-1.5 rounded-lg border font-medium flex items-center space-x-1.5 transition ${
            simulatedLoading 
              ? 'bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-300' 
              : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Loader2 className={`w-3.5 h-3.5 ${simulatedLoading ? 'animate-spin text-brand-500' : ''}`} />
          <span>{simulatedLoading ? 'Loading...' : 'Simulate Loading'}</span>
        </button>

        <button
          onClick={() => setSimulatedEmpty(prev => !prev)}
          className={`px-3 py-1.5 rounded-lg border font-medium flex items-center space-x-1.5 transition ${
            simulatedEmpty 
              ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300' 
              : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>{simulatedEmpty ? 'Empty Active' : 'Simulate Empty'}</span>
        </button>

        <button
          onClick={() => setSimulatedError(prev => !prev)}
          className={`px-3 py-1.5 rounded-lg border font-medium flex items-center space-x-1.5 transition ${
            simulatedError 
              ? 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300' 
              : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{simulatedError ? 'Error Active' : 'Simulate Error'}</span>
        </button>

        {(simulatedError || simulatedEmpty) && (
          <button
            onClick={() => {
              setSimulatedError(false);
              setSimulatedEmpty(false);
            }}
            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1"
            title="Reset states"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export function ErrorAlert({ 
  title = "Failed to load resource", 
  message = "An error occurred while communicating with the simulated data store.",
  onRetry 
}) {
  return (
    <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl p-6 text-rose-900 dark:text-rose-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 my-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-6 h-6 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-rose-900 dark:text-rose-300">{title}</h4>
          <p className="text-sm text-rose-700 dark:text-rose-300/80 mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-100 dark:bg-rose-900/60 hover:bg-rose-200 dark:hover:bg-rose-800/80 text-rose-900 dark:text-rose-100 text-sm font-medium rounded-xl border border-rose-300 dark:border-rose-700/50 transition shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
}

import React from 'react';

export function LoadingSpinner({ text = 'Loading data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 text-slate-500 dark:text-slate-400">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin"></div>
        <div className="absolute w-6 h-6 rounded-full border-4 border-brand-300/10 border-b-brand-400 animate-spin flex items-center justify-center"></div>
      </div>
      <p className="text-sm font-medium animate-pulse">{text}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="w-full h-40 bg-slate-200 dark:bg-slate-800/80 rounded-xl"></div>
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800/60 rounded w-1/2"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
      </div>
    </div>
  );
}

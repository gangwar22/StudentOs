import React from 'react';
import { FolderOpen, RefreshCw } from 'lucide-react';

export function EmptyState({ 
  title = "No results found", 
  description = "We couldn't find any items matching your criteria. Try resetting your filters.",
  actionText = "Clear Filters",
  onAction
}) {
  return (
    <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto my-8 border border-dashed border-slate-300 dark:border-slate-800">
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-500 dark:text-slate-400">
        <FolderOpen className="w-8 h-8 stroke-[1.5]" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      {onAction && (
        <button 
          onClick={onAction}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-xl transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}

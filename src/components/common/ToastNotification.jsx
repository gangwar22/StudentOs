import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Sparkles, 
  X, 
  Bot, 
  Zap, 
  RotateCcw,
  Award
} from 'lucide-react';

export function ToastNotification({ toast, onClose }) {
  if (!toast || !toast.message) return null;

  const { id, type = 'info', title, message, duration = 4500 } = toast;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getStyleAndIcon = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-900/30',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        };
      case 'award':
        return {
          bg: 'bg-gradient-to-r from-amber-950/95 via-indigo-950/95 to-slate-950/95 border-amber-400/50 text-amber-100 shadow-amber-900/40',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
          icon: <Award className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/90 border-amber-500/40 text-amber-100 shadow-amber-900/30',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          icon: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
        };
      case 'error':
        return {
          bg: 'bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-900/30',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        };
      case 'ai':
        return {
          bg: 'bg-gradient-to-r from-indigo-950/90 via-slate-900/90 to-purple-950/90 border-indigo-400/40 text-indigo-100 shadow-indigo-900/40',
          badge: 'bg-brand-500/20 text-brand-300 border-brand-400/30',
          icon: <Bot className="w-5 h-5 text-brand-400 shrink-0 animate-pulse" />
        };
      default:
        return {
          bg: 'bg-slate-900/95 border-indigo-500/30 text-slate-100 shadow-slate-900/40',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          icon: <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
        };
    }
  };

  const style = getStyleAndIcon();

  return (
    <div className={`fixed top-5 right-5 z-[9999] max-w-sm sm:max-w-md w-full p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform translate-y-0 animate-slide-in flex items-start space-x-3 ${style.bg}`}>
      <div className="p-2 rounded-xl bg-slate-900/50 border border-white/10 shrink-0">
        {style.icon}
      </div>

      <div className="flex-1 min-w-0 pr-2">
        {title && (
          <div className="flex items-center space-x-2 mb-1">
            <h5 className="font-black text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
              <span>{title}</span>
            </h5>
          </div>
        )}
        <p className="text-xs sm:text-sm font-medium leading-snug break-words">
          {message}
        </p>
      </div>

      <button
        onClick={() => onClose(id)}
        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  if (!Array.isArray(toasts) || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastNotification toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

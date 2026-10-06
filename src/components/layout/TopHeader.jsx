import React from 'react';
import { Menu, Search, Flame, Zap, Bell, Sun, Moon, PanelLeftClose, PanelLeftOpen, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

export function TopHeader({ setMobileOpen }) {
  const { user } = useAuth();
  const { searchQuery, setSearchQuery, sidebarCollapsed, toggleSidebarCollapse } = useLearning();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors shadow-xs">
      <div className="flex items-center space-x-3 flex-1 max-w-lg">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar Toggle */}
        <button
          onClick={toggleSidebarCollapse}
          className="hidden lg:flex p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition"
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        {/* Search Input with Shortcut Badge */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search curriculum, skills, projects, quizzes..."
            className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800 focus:border-brand-500 rounded-xl pl-10 pr-12 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition"
          />
          <kbd className="hidden sm:inline-flex items-center absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-800/80 rounded border border-slate-300/50 dark:border-slate-700/50">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right Stats & Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Day / Night Theme Toggle Switcher */}
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition shadow-2xs"
          title="Toggle Day White / Night Theme"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="hidden sm:inline">Light ☀️</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span className="hidden sm:inline">Dark 🌙</span>
            </>
          )}
        </button>

        {/* Streak Counter */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-2xs">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
          <span className="hidden sm:inline">{user?.streakDays || 1} Day Streak</span>
        </div>

        {/* XP Counter */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-400 text-xs font-bold shadow-2xs">
          <Zap className="w-4 h-4 fill-brand-500 text-brand-500" />
          <span>{user?.xpPoints || 0} XP</span>
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full animate-ping"></span>
        </button>

        {/* User Profile Avatar Link */}
        <Link to="/profile" className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <span className="w-8 h-8 rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-300 border-2 border-brand-500 hover:scale-105 transition shadow-xs flex items-center justify-center text-xs font-bold" aria-label={user?.name || 'Profile'}>
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </span>
        </Link>
      </div>
    </header>
  );
}

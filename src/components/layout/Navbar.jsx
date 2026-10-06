import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, Sparkles, ArrowRight, UserCheck, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition transform">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              Student<span className="text-brand-600 dark:text-brand-400">OS</span>
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">Developer Operating System</span>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link to="/" className={`hover:text-brand-600 dark:hover:text-brand-400 transition ${location.pathname === '/' ? 'text-brand-600 dark:text-brand-400 font-semibold' : ''}`}>
            Overview
          </Link>
          <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Features</a>
          <a href="#curriculum" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Full Stack Curriculum</a>
          <a href="#pricing" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Platform Specs</a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-sm shadow-md shadow-brand-500/20 transition"
            >
              <UserCheck className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm shadow-md shadow-brand-500/20 transition"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

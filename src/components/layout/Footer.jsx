import React from 'react';
import { Terminal, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-xs py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white">StudentOS</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            The modern learning operating system empowering developers to master web software engineering through interactive Coursera-style curriculum and real-world projects.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Core Modules</h4>
          <ul className="space-y-2">
            <li><Link to="/curriculum" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Curriculum Hub & Phases</Link></li>
            <li><Link to="/practice" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Practice Sandbox</Link></li>
            <li><Link to="/assessment" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Skill Diagnostic Quizzes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Curriculum Stack</h4>
          <ul className="space-y-2">
            <li><Link to="/curriculum" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Phase 1: HTML5 & Web Semantics</Link></li>
            <li><Link to="/curriculum" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Phase 2: CSS3 & Layouts</Link></li>
            <li><Link to="/curriculum" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Phase 2.5: JavaScript ES6+ & DOM</Link></li>
            <li><Link to="/curriculum" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Phase 3: React.js 18 Architecture</Link></li>
            <li><Link to="/curriculum" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Phase 4: Node.js & Express Backend</Link></li>
            <li><Link to="/curriculum" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Phase 5: Full Stack MERN & AI</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Connect</h4>
          <div className="flex space-x-3 mb-4">
            <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            © 2026 StudentOS. Built for ambitious developers.
          </p>
        </div>
      </div>
    </footer>
  );
}

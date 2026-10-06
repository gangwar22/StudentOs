import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Code2, 
  MapPin, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Layers, 
  ShieldCheck, 
  Users, 
  BookOpen,
  FolderGit2,
  Bot
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function Landing() {
  const features = [
    {
      title: 'Coursera-Style LMS Learning',
      description: 'Structured modules with videos, code notes, quizzes, and downloadable resources for HTML, CSS, JS, React, Node, Express & MongoDB.',
      icon: BookOpen,
      color: 'from-brand-500 to-cyan-500'
    },
    {
      title: 'Curriculum Progression System',
      description: 'Sequential phase progression with real-time status tracking, skill prerequisites, and milestone completion checks.',
      icon: Layers,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'Diagnostic Skill Matrix',
      description: 'Verify your mastery across frontend, backend, database, and DevOps domains through automated timed quiz assessments.',
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: '24/7 AI Code Mentor',
      description: 'Context-aware AI tutor to help debug syntax errors, explain complex concepts, and review code implementations instantly.',
      icon: Bot,
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Portfolio Projects Hub',
      description: 'Real-world project briefs with starter templates, API specs, git commands, and submission tracking.',
      icon: FolderGit2,
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Career & ATS Readiness',
      description: 'Developer job matching, ATS resume scoring simulation, and interactive technical interview prep banks.',
      icon: Users,
      color: 'from-blue-500 to-indigo-500'
    }
  ];

  const courses = [
    { title: 'HTML5 Fundamentals', level: 'Beginner', duration: '8 Hours', icon: '🌐', color: 'border-orange-500/30 bg-orange-500/10 text-orange-400' },
    { title: 'CSS3 & Tailwind CSS', level: 'Beginner', duration: '12 Hours', icon: '🎨', color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400' },
    { title: 'JavaScript ES6+ Core', level: 'Intermediate', duration: '20 Hours', icon: '⚡', color: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400' },
    { title: 'React 18 Architecture', level: 'Intermediate', duration: '24 Hours', icon: '⚛️', color: 'border-blue-500/30 bg-blue-500/10 text-blue-400' },
    { title: 'Node.js Async Runtime', level: 'Intermediate', duration: '16 Hours', icon: '🟢', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
    { title: 'Express.js REST APIs', level: 'Intermediate', duration: '14 Hours', icon: '🚀', color: 'border-purple-500/30 bg-purple-500/10 text-purple-400' },
    { title: 'MongoDB & Mongoose', level: 'Intermediate', duration: '18 Hours', icon: '🍃', color: 'border-green-500/30 bg-green-500/10 text-green-400' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 border-b border-slate-200/80 dark:border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/10 dark:from-brand-900/30 via-slate-50 dark:via-slate-950 to-slate-50 dark:to-slate-950 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-semibold tracking-wide uppercase shadow-inner">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 animate-spin-slow" />
            <span>The Developer Learning OS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Master Full-Stack Web Engineering with <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600 dark:from-brand-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">StudentOS</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            All-in-one developer operating system equipped with Coursera-like interactive courses, AI code mentorship, skill matrix diagnostics, and career readiness tools.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-base shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/learning"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-base flex items-center justify-center space-x-2 transition shadow-sm"
            >
              <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>Browse Full Curriculum</span>
            </Link>
          </div>

          {/* Interactive Code Mockup */}
          <div className="pt-12 max-w-4xl mx-auto">
            <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 p-4 text-left shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80 px-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">StudentOS / mern-curriculum.jsx</span>
                </div>
                <div className="text-[11px] font-mono bg-brand-500/10 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded border border-brand-500/20">Coursera Engine Active</div>
              </div>
              <div className="p-4 font-mono text-xs sm:text-sm text-slate-200 bg-slate-900 dark:bg-slate-950/80 rounded-xl overflow-x-auto">
                <p className="text-purple-400">import <span className="text-white">{"{ StudentOS, CourseraLMS }"}</span> from <span className="text-emerald-300">'@studentos/core'</span>;</p>
                <br />
                <p className="text-slate-400">// Pre-loaded MERN Stack Modules</p>
                <p className="text-blue-400">const <span className="text-yellow-300">courses</span> = [<span className="text-emerald-300">'HTML'</span>, <span className="text-emerald-300">'CSS'</span>, <span className="text-emerald-300">'JavaScript'</span>, <span className="text-emerald-300">'React'</span>, <span className="text-emerald-300">'Node'</span>, <span className="text-emerald-300">'Express'</span>, <span className="text-emerald-300">'MongoDB'</span>];</p>
                <br />
                <p><span className="text-purple-400">export default function</span> <span className="text-brand-300">LearningEngine</span>() {"{"}</p>
                <p className="pl-4 text-slate-400">return &lt;<span className="text-brand-400">StudentOS</span> stack={"{"}courses{"}"} mentor=<span className="text-emerald-300">"AI"</span> /&gt;;</p>
                <p>{"}"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="py-12 bg-slate-100/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">7+</p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Full Stack Core Courses</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-brand-600 dark:text-brand-400">100%</p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Interactive Dummy Data</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">24/7</p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">AI Mentor Assistance</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">13</p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Integrated OS Modules</p>
          </div>
        </div>
      </section>

      {/* Course Showcase */}
      <section id="curriculum" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Pre-loaded Full Stack Web Development Curriculum
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Just like Coursera, opening any course provides instant access to video tutorials, code notes, quizzes, and downloadable resources.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:scale-[1.02] transition">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">{course.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{course.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Duration: {course.duration}</p>
              </div>
              <Link
                to={`/learning/${course.title.toLowerCase().split(' ')[0]}`}
                className="w-full text-center py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-white transition flex items-center justify-center space-x-1"
              >
                <span>Explore Material</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-slate-100/50 dark:bg-slate-900/40 border-t border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Everything You Need in One Unified Platform
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              No need to switch between fragmented tools. StudentOS integrates curriculum phases, assessments, projects, and career tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="glass-card rounded-2xl p-8 space-y-4 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

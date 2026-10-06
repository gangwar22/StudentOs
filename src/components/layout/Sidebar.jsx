import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Bot, 
  User, 
  LogOut,
  Terminal,
  Code2,
  Layers,
  Target,
  Brain,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';

export function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebarCollapse } = useLearning();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Curriculum Hub', path: '/curriculum', icon: Layers, highlight: true, badge: 'Active' },
    { name: 'Goals Tracker', path: '/goals', icon: Target },
    { name: 'AI Reflections', path: '/reflections', icon: Brain, badge: 'NVIDIA AI' },
    { name: 'Practice Sandbox', path: '/practice', icon: Code2 },
    { name: 'Assessments (15-Q Quiz)', path: '/assessment', icon: CheckSquare },
    { name: 'AI Mentor', path: '/mentor', icon: Bot },
    { name: 'Profile & Settings', path: '/profile', icon: User },
    ...(user?.accessLevel === 'admin' || user?.accessLevel === 'super_admin'
      ? [{ 
          name: user.accessLevel === 'super_admin' ? 'Super Admin' : 'Admin Console', 
          path: user.accessLevel === 'super_admin' ? '/super-admin' : '/admin', 
          icon: ShieldCheck,
          badge: user.accessLevel === 'super_admin' ? 'Super' : 'Admin'
        }]
      : []),
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800/80 flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header */}
        <div>
          <div className={`h-16 flex items-center border-b border-slate-200/90 dark:border-slate-800/80 transition-all ${sidebarCollapsed ? 'px-3 justify-center' : 'px-5 justify-between'}`}>
            <NavLink to="/dashboard" className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-md shrink-0">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                  Student<span className="text-brand-600 dark:text-brand-400">OS</span>
                </span>
              )}
            </NavLink>

            {/* Desktop Collapse Toggle Button inside Sidebar */}
            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-12rem)] custom-scrollbar">
            {!sidebarCollapsed && (
              <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Workspace Modules
              </div>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={sidebarCollapsed ? item.name : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center ${sidebarCollapsed ? 'justify-center py-2.5 px-0' : 'justify-between px-3.5 py-2.5'} rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-gradient-to-r from-brand-500/15 to-indigo-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/30 font-bold shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'}
                  `}
                >
                  <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} truncate`}>
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${item.highlight ? 'text-brand-600 dark:text-brand-400' : ''}`} />
                    {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                  </div>

                  {!sidebarCollapsed && item.badge && (
                    <span className="text-[10px] bg-brand-500/15 text-brand-700 dark:text-brand-300 font-extrabold px-2 py-0.5 rounded-full border border-brand-500/30 shrink-0 shadow-2xs">
                      {item.badge}
                    </span>
                  )}

                  {sidebarCollapsed && item.badge && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer User & Logout Action */}
        <div className="p-3 border-t border-slate-200/90 dark:border-slate-800/80 space-y-3">
          <div className={`flex items-center ${sidebarCollapsed ? 'flex-col space-y-2 justify-center' : 'justify-between px-2'}`}>
            <NavLink
              to="/profile"
              className="flex items-center space-x-2.5 truncate hover:opacity-80 transition group"
              title={sidebarCollapsed ? user?.name : "View Profile"}
            >
              <div className="w-8 h-8 rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30 shrink-0 flex items-center justify-center text-xs font-bold shadow-2xs group-hover:scale-105 transition" aria-hidden="true">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              {!sidebarCollapsed && (
                <div className="truncate text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>
              )}
            </NavLink>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

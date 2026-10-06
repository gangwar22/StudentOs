import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const Landing = lazy(() => import('./pages/Landing').then((module) => ({ default: module.Landing })));
const Login = lazy(() => import('./pages/Login').then((module) => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register').then((module) => ({ default: module.Register })));
const Onboarding = lazy(() => import('./pages/Onboarding').then((module) => ({ default: module.Onboarding })));
const WorkspaceRoutes = lazy(() => import('./WorkspaceRoutes'));
const AdminPanel = lazy(() => import('./pages/AdminPanel').then((module) => ({ default: module.AdminPanel })));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm font-medium text-slate-500 dark:bg-slate-950 dark:text-slate-400">
      Loading StudentOS…
    </div>
  );
}

function AuthErrorPage({ message }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center dark:bg-slate-950">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">Could not verify your session</h1>
      <p role="alert" className="max-w-md text-sm text-slate-600 dark:text-slate-400">{message}</p>
      <button onClick={() => window.location.reload()} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500">
        Retry
      </button>
      <Link to="/login" className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300">Go to sign in</Link>
    </main>
  );
}

function ProtectedRoute({ children, accessLevels }) {
  const { isAuthenticated, isLoading, authError, user } = useAuth();
  const location = useLocation();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) {
    if (authError) return <AuthErrorPage message={authError} />;
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Super-admin only has the Super Admin Dashboard and nothing else
  if (user?.accessLevel === 'super_admin' && !location.pathname.startsWith('/super-admin')) {
    return <Navigate to="/super-admin" replace />;
  }

  if (accessLevels && !accessLevels.includes(user?.accessLevel)) {
    if (user?.accessLevel === 'super_admin') return <Navigate to="/super-admin" replace />;
    if (user?.accessLevel === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route
          path="/admin"
          element={<ProtectedRoute accessLevels={['admin', 'super_admin']}><AdminPanel /></ProtectedRoute>}
        />
        <Route
          path="/super-admin"
          element={<ProtectedRoute accessLevels={['super_admin']}><AdminPanel /></ProtectedRoute>}
        />
        <Route
          path="/*"
          element={<ProtectedRoute><WorkspaceRoutes /></ProtectedRoute>}
        />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

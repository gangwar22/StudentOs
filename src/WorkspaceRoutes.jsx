import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LearningProvider } from './context/LearningContext';

const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const Curriculum = lazy(() => import('./pages/Curriculum').then((module) => ({ default: module.Curriculum })));
const GoalsHub = lazy(() => import('./pages/GoalsHub').then((module) => ({ default: module.GoalsHub })));
const ReflectionsHub = lazy(() => import('./pages/ReflectionsHub').then((module) => ({ default: module.ReflectionsHub })));
const ReflectionSession = lazy(() => import('./pages/ReflectionSession').then((module) => ({ default: module.ReflectionSession })));
const Assessment = lazy(() => import('./pages/Assessment').then((module) => ({ default: module.Assessment })));
const Practice = lazy(() => import('./pages/Practice').then((module) => ({ default: module.Practice })));
const AIMentor = lazy(() => import('./pages/AIMentor').then((module) => ({ default: module.AIMentor })));
const Profile = lazy(() => import('./pages/Profile').then((module) => ({ default: module.Profile })));

function WorkspaceLoader() {
  return <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">Loading workspace…</div>;
}

export default function WorkspaceRoutes() {
  return (
    <LearningProvider>
      <Suspense fallback={<WorkspaceLoader />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/curriculum" element={<Curriculum />} />
          <Route path="/goals" element={<GoalsHub />} />
          <Route path="/reflections" element={<ReflectionsHub />} />
          <Route path="/reflections/live" element={<ReflectionSession />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/mentor" element={<AIMentor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/learning" element={<Navigate to="/curriculum" replace />} />
          <Route path="/learning/:courseId" element={<Navigate to="/curriculum" replace />} />
          <Route path="/career" element={<Navigate to="/curriculum" replace />} />
          <Route path="/projects" element={<Navigate to="/curriculum" replace />} />
          <Route path="/skills" element={<Navigate to="/profile" replace />} />
          <Route path="/roadmap" element={<Navigate to="/curriculum" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </LearningProvider>
  );
}

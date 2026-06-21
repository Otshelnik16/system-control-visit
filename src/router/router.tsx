import { Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Login } from '../components/pages/login/login.tsx';
import { MainStudent } from '../components/pages/MainStudent/mainStudent.tsx';
import { MainTeacher } from '../components/pages/MainTeacher/mainTeacher.tsx'; 

interface ProtectedRouteProps {
  children: ReactNode;
  role?: 'student' | 'teacher';
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const userRole = localStorage.getItem('role') as 'student' | 'teacher' | null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role && userRole !== role) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <MainStudent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <MainTeacher /> {/* 👈 ТЕПЕРЬ НАСТОЯЩАЯ СТРАНИЦА */}
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<h1>404 — Страница не найдена</h1>} />
    </Routes>
  );
};
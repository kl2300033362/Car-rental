import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Header } from './components/Layout/Header';
import { AuthForm } from './components/Auth/AuthForm';
import { StudentDashboard } from './components/Dashboard/StudentDashboard';
import { InstructorDashboard } from './components/Dashboard/InstructorDashboard';
import { CourseCatalog } from './components/Courses/CourseCatalog';
import { CourseDetail } from './components/Courses/CourseDetail';
import { MyCourses } from './components/Courses/MyCourses';
import { AssignmentList } from './components/Assignments/AssignmentList';
import { DiscussionList } from './components/Discussions/DiscussionList';
import { ProtectedRoute } from './components/Routes/ProtectedRoute';

function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === 'student' ? <StudentDashboard /> : <InstructorDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/auth" element={<AuthForm />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CourseCatalog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-courses"
              element={
                <ProtectedRoute requireRole="student">
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id"
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignments"
              element={
                <ProtectedRoute>
                  <AssignmentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/discussions"
              element={
                <ProtectedRoute>
                  <DiscussionList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor"
              element={
                <ProtectedRoute requireRole="instructor">
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
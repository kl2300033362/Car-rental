import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/Routes/ProtectedRoute';
import { AuthForm } from './components/Auth/AuthForm';
import { Dashboard } from './pages/Dashboard';
import { Home, AlertTriangle } from 'lucide-react';

// Lazy-load heavy pages to improve time-to-first-render
const Courses = lazy(() => import('./pages/CoursesPage'));
const Assignments = lazy(() => import('./pages/AssignmentsPage'));
const InstructorDashboard = lazy(() => import('./pages/InstructorDashboardPage'));

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-4">We encountered an unexpected error. Please refresh the page or try again later.</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Refresh Page</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8 text-gray-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <Home className="w-4 h-4 mr-2" />
        Go Home
      </a>
    </div>
  </div>
);

const Unauthorized = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
      <a href="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <Home className="w-4 h-4 mr-2" />
        Go to Dashboard
      </a>
    </div>
  </div>
);

function App() {
  const suspenseFallback = (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<AuthForm />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected routes */}
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
                    <Suspense fallback={suspenseFallback}>
                      <Courses />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/assignments"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={suspenseFallback}>
                      <Assignments />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/instructor"
                element={
                  <ProtectedRoute requireRole="instructor">
                    <Suspense fallback={suspenseFallback}>
                      <InstructorDashboard />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              {/* 404 route */}
              <Route path="/404" element={<NotFound />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
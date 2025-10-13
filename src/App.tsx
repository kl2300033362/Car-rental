import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/Routes/ProtectedRoute';
import { AuthForm } from './components/Auth/AuthForm';
import { Dashboard } from './pages/Dashboard';

// Placeholder components for missing pages
const Courses = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
      <p className="text-gray-600 mt-2">Course catalog will be implemented here</p>
      <a 
        href="/" 
        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Dashboard
      </a>
    </div>
  </div>
);

const Assignments = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
      <p className="text-gray-600 mt-2">Assignment management will be implemented here</p>
      <a 
        href="/" 
        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Dashboard
      </a>
    </div>
  </div>
);

const InstructorDashboard = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
      <p className="text-gray-600 mt-2">Instructor-specific features will be implemented here</p>
      <a 
        href="/" 
        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Dashboard
      </a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<AuthForm />} />
            
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
                  <Courses />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/assignments" 
              element={
                <ProtectedRoute>
                  <Assignments />
                </ProtectedRoute>
              } 
            />
            
            {/* Instructor-only routes */}
            <Route 
              path="/instructor" 
              element={
                <ProtectedRoute requireRole="instructor">
                  <InstructorDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
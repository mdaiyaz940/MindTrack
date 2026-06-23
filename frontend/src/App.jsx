import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/layout/Header';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import Dashboard from './pages/Dashboard';
import Mood from './pages/Mood';
import Journal from './pages/Journal';
import AIChat from './pages/AIChat';
import Analytics from './pages/Analytics';
import Resources from './pages/Resources';
import Landing from './pages/Landing';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />
            
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Header />
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/mood" element={
                <ProtectedRoute>
                  <Header />
                  <Mood />
                </ProtectedRoute>
              } />
              
              <Route path="/journal" element={
                <ProtectedRoute>
                  <Header />
                  <Journal />
                </ProtectedRoute>
              } />
              
              <Route path="/ai-chat" element={
                <ProtectedRoute>
                  <Header />
                  <AIChat />
                </ProtectedRoute>
              } />
              
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Header />
                  <Analytics />
                </ProtectedRoute>
              } />
              
              <Route path="/resources" element={
                <ProtectedRoute>
                  <Header />
                  <Resources />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
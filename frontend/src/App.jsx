import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import DocumentQuiz from './pages/DocumentQuiz';
import TopicQuiz from './pages/TopicQuiz';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import QuizHistory from './pages/QuizHistory';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import { ChallengeProvider } from './context/ChallengeContext';
import ArenaTransitionOverlay from './components/ArenaTransitionOverlay';

// Route Guard for Authenticated Pages
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner fullPage={true} message="Authenticating session..." />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Route Guard to prevent signed-in users from entering Login/Register
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner fullPage={true} message="Verifying session..." />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Layout Wrapper for Private pages
const AppLayout = ({ children, title }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title={title} />
        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <PublicRoute>
          <LandingPage />
        </PublicRoute>
      } />
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <AppLayout title="Dashboard">
            <Dashboard />
          </AppLayout>
        </PrivateRoute>
      } />
      <Route path="/document-quiz" element={
        <PrivateRoute>
          <AppLayout title="Document Quiz Generator">
            <DocumentQuiz />
          </AppLayout>
        </PrivateRoute>
      } />
      <Route path="/topic-quiz" element={
        <PrivateRoute>
          <AppLayout title="Topic Quiz Generator">
            <TopicQuiz />
          </AppLayout>
        </PrivateRoute>
      } />
      <Route path="/quiz/:quizId" element={
        <PrivateRoute>
          <AppLayout title="Quiz Session">
            <QuizPage />
          </AppLayout>
        </PrivateRoute>
      } />
      <Route path="/results/:quizId" element={
        <PrivateRoute>
          <AppLayout title="Evaluation Report">
            <ResultsPage />
          </AppLayout>
        </PrivateRoute>
      } />
      <Route path="/history" element={
        <PrivateRoute>
          <AppLayout title="Quiz History">
            <QuizHistory />
          </AppLayout>
        </PrivateRoute>
      } />

      {/* Fallback routing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ChallengeProvider>
            <ArenaTransitionOverlay />
            <AppRoutes />
          </ChallengeProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

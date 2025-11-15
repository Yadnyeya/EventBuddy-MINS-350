import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCurrentUser } from './services/supabase';
import './App.css';

// Import pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventCreatePage from './pages/EventCreatePage';
import EventDetailPage from './pages/EventDetailPage';
import NetworkPage from './pages/NetworkPage';
import AttendTogetherPage from './pages/AttendTogetherPage';
import ConnectPage from './pages/ConnectPage';
import ProfilePage from './pages/ProfilePage';
import ShareExperiencePage from './pages/ShareExperiencePage';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute>
                <ProfileSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/create"
            element={
              <ProtectedRoute>
                <EventCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <EventDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attend"
            element={
              <ProtectedRoute>
                <AttendTogetherPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connect"
            element={
              <ProtectedRoute>
                <ConnectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/network"
            element={
              <ProtectedRoute>
                <NetworkPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/share"
            element={
              <ProtectedRoute>
                <ShareExperiencePage />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
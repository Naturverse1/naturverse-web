import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ProfilePage from './pages/Profile';
import AuthCallback from './pages/AuthCallback';
import PrivateRoute from './components/PrivateRoute';
import AppRedirect from './components/AppRedirect';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

  {/* /app route: redirect to /profile if signed in, else /login */}
  <Route path="/app" element={<AppRedirect />} />
      {/* Auth callback route */}
      <Route path="/auth/callback" element={<AuthCallback />} />
      {/* Protected profile route */}
      <Route path="/profile" element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      } />
      {/* Catch-all: redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

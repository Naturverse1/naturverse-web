import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AppHome from './pages/AppHome';
import ProfilePage from './pages/Profile';
import AuthCallback from './pages/AuthCallback';
import PrivateRoute from './components/PrivateRoute';
import RequireAuth from './components/RequireAuth';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Protected app area */}
      <Route path="/app" element={
        <RequireAuth>
          <AppHome />
        </RequireAuth>
      } />
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

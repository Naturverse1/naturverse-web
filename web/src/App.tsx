import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ProfilePage from './pages/Profile';
import AuthCallback from './pages/auth/Callback';
import ProtectedRoute from './components/ProtectedRoute';
import AppRedirect from './components/AppRedirect';
import Navbar from './components/Navbar';
import { useAuth } from './providers/AuthProvider';

export default function App() {
  const { authLoaded, session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoaded && !session && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [authLoaded, session, location.pathname, navigate]);

  if (!authLoaded) return <div style={{ padding: 32 }}>Loading…</div>;

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/app" element={<ProtectedRoute><AppRedirect /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        {/* Catch-all: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

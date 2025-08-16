import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ProfilePage from './pages/Profile';
import AuthCallback from './pages/auth/Callback';
import ProtectedRoute from './components/ProtectedRoute';
import AppRedirect from './components/AppRedirect';
import Navbar from './components/Navbar';
import { supabase } from './supabaseClient';

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoaded(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_IN") {
        setSession(session);
        setUser(session?.user ?? null);
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
      }
    });
    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Guarded routes
  function PrivateRoute({ element }: { element: JSX.Element }) {
    if (!authLoaded) return null;
    if (!session) {
      if (location.pathname !== "/login") navigate("/login");
      return null;
    }
    return element;
  }

  if (!authLoaded) return <div style={{ padding: 32 }}>Loading…</div>;

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/app" element={<PrivateRoute element={<AppRedirect />} />} />
        <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
        {/* Catch-all: redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

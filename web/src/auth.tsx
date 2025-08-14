import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthed: boolean;
  loading: boolean;
  user: any;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      setLoading(true);
      try {
        const res = await fetch('/user');
        if (res.ok) {
          const json = await res.json();
          setUser(json.data);
          setIsAuthed(true);
          if (window.location.pathname === '/') navigate('/app');
        } else {
          setUser(null);
          setIsAuthed(false);
          if (window.location.pathname !== '/') navigate('/');
        }
      } catch {
        setUser(null);
        setIsAuthed(false);
        if (window.location.pathname !== '/') navigate('/');
      }
      setLoading(false);
    }
    checkAuth();
    // Optionally listen to storage events for cross-tab logout
    const onStorage = () => checkAuth();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthed, loading, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

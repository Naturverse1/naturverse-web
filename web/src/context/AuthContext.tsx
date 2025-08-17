import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

type AuthState = {
  loading: boolean;
  session: any | null;
  user: any | null;
  signOut: () => Promise<void>;
  setNavatarLocal: (url: string | null) => void;
};

const Ctx = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const nav = useNavigate();
  const loc = useLocation();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const setNavatarLocal = (url: string | null) => {
    try {
      if (url) localStorage.setItem('navatar_url', url);
      else localStorage.removeItem('navatar_url');
    } catch {}
  };

  // Initial load + URL cleanup (handles magic-link fragments)
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);

      // If magic link appended params, clean them and route to /app by default
      const hash = window.location.hash || '';
      const looksLikeToken = /access_token=|type=recovery|type=signup|type=invite/.test(hash);
      if (looksLikeToken) {
        // Clean hash to avoid multiple sign-ins on refresh
        history.replaceState({}, document.title, window.location.pathname + window.location.search);
        // Redirect target: if already on /profile /app keep it; else go to /app
        if (!loc.pathname.startsWith('/app') && !loc.pathname.startsWith('/profile')) {
          nav('/app', { replace: true });
        }
      }
    })();

    // Subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, sess) => {
      setSession(sess ?? null);
      setUser(sess?.user ?? null);
      if (event === 'SIGNED_OUT') {
        setNavatarLocal(null);
        // If leaving a protected page, go home
        if (window.location.pathname.startsWith('/app') || window.location.pathname.startsWith('/profile')) {
          nav('/', { replace: true });
        }
      }
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        // Optional: fetch profile row to mirror avatar_url
        try {
          const uid = sess?.user?.id;
          if (uid) {
            const { data: rows } = await supabase.from('users').select('avatar_url').eq('id', uid).limit(1).maybeSingle();
            if (rows?.avatar_url) setNavatarLocal(rows.avatar_url);
          }
        } catch {}
      }
    });

    return () => sub?.subscription?.unsubscribe();
  }, [nav, loc.pathname]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo<AuthState>(() => ({
    loading, session, user, signOut, setNavatarLocal
  }), [loading, session, user]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Route guard
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading, user } = useAuth();
  if (loading) return <div style={{padding:'2rem'}}>Loading…</div>;
  if (!user) {
    return (
      <div style={{padding:'2rem'}}>
        <h1>Sign in required</h1>
        <p>Please sign in with your magic link, then return here.</p>
        <a href="/">Go to Home</a>
      </div>
    );
  }
  return <>{children}</>;
};


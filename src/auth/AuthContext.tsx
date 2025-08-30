import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase-client';

type AuthCtx = { user: User | null; loading: boolean; refresh: () => Promise<void>; signOut: () => Promise<void>; };
const Ctx = createContext<AuthCtx>({ user: null, loading: true, refresh: async () => {}, signOut: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.auth.getUser();
    setUser(data.user ?? null);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const hardClearLocalAuth = () => {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith('sb-')) localStorage.removeItem(k);
    });
    sessionStorage.removeItem('nv-sw-killed');
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (_) {
    } finally {
      hardClearLocalAuth();
      if ('caches' in window) {
        try {
          const names = await caches.keys();
          await Promise.all(names.map((n) => caches.delete(n)));
        } catch {}
      }
      window.location.replace('/');
    }
  };

  return (
    <Ctx.Provider value={{ user, loading, refresh: load, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);

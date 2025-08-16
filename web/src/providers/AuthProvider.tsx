import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/supabaseClient';

type Ctx = {
  user: ReturnType<typeof supabase.auth.getUser> extends Promise<infer _> ? any : any;
  session: any;
  authLoaded: boolean;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<Ctx>({ user: null, session: null, authLoaded: false, signOut: async () => {} });
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setAuthLoaded(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ?? null);
      setUser(s?.user ?? null);
      setAuthLoaded(true);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthCtx.Provider value={{ user, session, authLoaded, signOut: () => supabase.auth.signOut() }}>
      {children}
    </AuthCtx.Provider>
  );
}

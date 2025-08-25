import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';
import { upsertProfile } from '../lib/upsertProfile';

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Pick up existing session and listen for changes
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);

      if (data.session?.user) {
        await upsertProfile(data.session.user.id, data.session.user.email);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
      setUser(s?.user ?? null);
      setLoading(false);

      if (s?.user) {
        upsertProfile(s.user.id, s.user.email);
      }
    });

    return () => {
      sub.subscription.unsubscribe();
      mounted = false;
    };
  }, []);

  // Email magic link
  const signInWithEmail: AuthCtx['signInWithEmail'] = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }, // safe default
    });
    return { error: error?.message };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo<AuthCtx>(
    () => ({ user, session, loading, signInWithEmail, signOut }),
    [user, session, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}


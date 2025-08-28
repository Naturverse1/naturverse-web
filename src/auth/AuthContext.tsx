import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { useSupabase } from '@/lib/useSupabase';
import { upsertProfile } from '../lib/upsertProfile';
import { sendMagicLink } from '../lib/auth';

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Pick up existing session and listen for changes
  useEffect(() => {
    let mounted = true;
    if (!supabase) {
      setLoading(false);
      return;
    }

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);

      if (data.session?.user) {
        await upsertProfile(data.session.user.id, data.session.user.email ?? null);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
      setUser(s?.user ?? null);
      setLoading(false);

      if (s?.user) {
        upsertProfile(s.user.id, s.user.email ?? null);
      }
    });

    return () => {
      sub.subscription.unsubscribe();
      mounted = false;
    };
  }, [supabase]);

  // Email magic link
  const signInWithEmail: AuthCtx['signInWithEmail'] = async (email) => {
    if (!supabase) return { error: 'no-supabase' };
    sessionStorage.setItem('post-auth-redirect', window.location.pathname + window.location.search);
    const { error } = await sendMagicLink(email);
    return { error: error?.message };
  };

  const signOut = async () => {
    if (!supabase) return;
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


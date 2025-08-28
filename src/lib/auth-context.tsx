import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { useSupabase } from './useSupabase';
import { signInWithGoogle as startGoogleOAuth, sendMagicLink } from './auth';

type Ctx = {
  ready: boolean;
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signInWithMagicLink: () => Promise<void>;
  signOut: () => Promise<void>;
};

const noop = async () => {};
const AuthCtx = createContext<Ctx>({
  ready: false,
  user: null,
  signInWithGoogle: noop,
  signInWithMagicLink: noop,
  signOut: noop,
});

export function AuthProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: Session | null;
}) {
  const supabase = useSupabase();
  const [ready, setReady] = useState(Boolean(initialSession));
  const [user, setUser] = useState<Ctx['user']>(initialSession?.user ?? null);

  const signInWithMagicLink = async () => {
    const email = window.prompt('Enter your email to receive a sign-in link')?.trim();
    if (!email) return;
    sessionStorage.setItem('post-auth-redirect', window.location.pathname + window.location.search);
    try {
      await sendMagicLink(email);
      alert('Check your inbox for the sign-in link ✉️');
    } catch (err) {
      alert((err as { message: string }).message);
    }
  };

  const signInWithGoogle = async () => {
    sessionStorage.setItem('post-auth-redirect', window.location.pathname + window.location.search);
    try {
      await startGoogleOAuth();
    } catch (err) {
      alert((err as { message: string }).message);
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  };

  // Stay in sync after first paint
  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    const { data } = supabase.auth.onAuthStateChange((_ev: AuthChangeEvent, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });
    // also fetch once on mount so the homepage knows immediately
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const value = useMemo(
    () => ({ ready, user, signInWithGoogle, signInWithMagicLink, signOut }),
    [ready, user],
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);


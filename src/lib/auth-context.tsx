import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, signInWithGoogle as startGoogleOAuth, sendMagicLink } from './auth';

type Ctx = {
  ready: boolean;
  user: null | NonNullable<
    Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']
  >['user'];
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
  initialSession: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'] | null;
}) {
  const [ready, setReady] = useState(Boolean(initialSession));
  const [user, setUser] = useState<Ctx['user']>(initialSession?.user ?? null);

  const signInWithMagicLink = async () => {
    const email = window.prompt('Enter your email to receive a sign-in link')?.trim();
    if (!email) return;
    sessionStorage.setItem('postAuthRedirect', window.location.pathname + window.location.search);
    try {
      await sendMagicLink(email);
      alert('Check your inbox for the sign-in link ✉️');
    } catch (err) {
      alert((err as { message: string }).message);
    }
  };

  const signInWithGoogle = async () => {
    sessionStorage.setItem('postAuthRedirect', window.location.pathname + window.location.search);
    try {
      await startGoogleOAuth();
    } catch (err) {
      alert((err as { message: string }).message);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    window.location.assign('/');
  };

  // Stay in sync after first paint
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_ev, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });
    // also fetch once on mount so the homepage knows immediately
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({ ready, user, signInWithGoogle, signInWithMagicLink, signOut }),
    [ready, user],
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);


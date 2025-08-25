import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase-client';

type Ctx = {
  ready: boolean;
  user: null | NonNullable<
    Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']
  >['user'];
};

const AuthCtx = createContext<Ctx>({ ready: false, user: null });

export function AuthProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'] | null;
}) {
  const [ready, setReady] = useState(Boolean(initialSession));
  const [user, setUser] = useState<Ctx['user']>(initialSession?.user ?? null);

  // Stay in sync after first paint
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_ev, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({ ready, user }), [ready, user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);


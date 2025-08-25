'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

type AuthState = { loading: boolean; signedIn: boolean; email?: string | null };
const Ctx = createContext<AuthState>({ loading: true, signedIn: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ loading: true, signedIn: false });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setState({
        loading: false,
        signedIn: !!data.session,
        email: data.session?.user.email ?? null,
      });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setState({ loading: false, signedIn: !!session, email: session?.user.email ?? null });
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useAuthState = () => useContext(Ctx);

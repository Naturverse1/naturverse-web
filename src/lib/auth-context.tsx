'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';

type AuthState = {
  loading: boolean;
  signedIn: boolean;
  email?: string | null;
};

const Ctx = createContext<AuthState>({ loading: true, signedIn: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ loading: true, signedIn: false });

  async function loadOnce() {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    setState({
      loading: false,
      signedIn: !!data.session,
      email: data.session?.user.email ?? null,
    });
  }

  useEffect(() => {
    const supabase = createClient();

    // Initial check (covers coming back from OAuth/magic link)
    loadOnce();

    // Live updates for sign-in / sign-out
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setState({
        loading: false,
        signedIn: !!session,
        email: session?.user.email ?? null,
      });
    });

    // Also update when tab becomes visible or another tab signs in/out
    const onVis = () => loadOnce();
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('sb-')) loadOnce();
    };

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('storage', onStorage);

    return () => {
      sub.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useAuthState = () => useContext(Ctx);

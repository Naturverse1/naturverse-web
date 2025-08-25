// Auth context with immediate sync + live updates
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createClient } from './supabase-client';

type AuthState = {
  loading: boolean;
  signedIn: boolean;
  email?: string | null;
  version: number; // increments on any auth change to force clean remounts
};

const AuthCtx = createContext<AuthState>({
  loading: true,
  signedIn: false,
  email: null,
  version: 0,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    loading: true,
    signedIn: false,
    email: null,
    version: 0,
  });

  useEffect(() => {
    const sb = createClient();

    const sync = async () => {
      const { data } = await sb.auth.getSession();
      setState((s) => ({
        loading: false,
        signedIn: !!data.session,
        email: data.session?.user?.email ?? null,
        version: s.version + 1,
      }));
    };

    // Initial (covers OAuth/magic-link return)
    sync();

    // Live updates
    const { data: sub } = sb.auth.onAuthStateChange((_evt, session) => {
      setState((s) => ({
        loading: false,
        signedIn: !!session,
        email: session?.user?.email ?? null,
        version: s.version + 1,
      }));
    });

    // Cross-tab + when tab becomes visible
    const onVisible = () => {
      if (document.visibilityState === 'visible') sync();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('sb-')) sync();
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('storage', onStorage);

    return () => {
      sub.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const value = useMemo(
    () => state,
    [state.loading, state.signedIn, state.email, state.version]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuthState = () => useContext(AuthCtx);

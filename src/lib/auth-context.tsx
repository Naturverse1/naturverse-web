'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

type AuthState = { loading: boolean; signedIn: boolean; email?: string | null };
const Ctx = createContext<AuthState>({ loading: true, signedIn: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ loading: true, signedIn: false });
  const router = useRouter();

  async function loadOnce() {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const signedIn = !!data.session;
    setState({ loading: false, signedIn, email: data.session?.user.email ?? null });
    if (signedIn) router.refresh(); // <- ensure first render shows signed-in UI
  }

  useEffect(() => {
    const supabase = createClient();
    loadOnce(); // initial check

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const signedIn = !!session;
      setState({ loading: false, signedIn, email: session?.user.email ?? null });
      router.refresh(); // <- flip UI immediately on sign-in/out
    });

    // when coming back from OAuth/magic-link, browsers sometimes cache;
    // these two listeners help update on tab switch & multi-tab:
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
  }, [router]);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useAuthState = () => useContext(Ctx);

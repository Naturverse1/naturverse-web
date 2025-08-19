import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSupabase, SafeSupabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

type AuthState = { session: Session | null; user: User | null; loading: boolean; };
const AuthContext = createContext<AuthState>({ session: null, user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ session: null, user: null, loading: true });

  useEffect(() => {
    const supabase = getSupabase() ?? (SafeSupabase as any);
    if (!supabase) {
      setState({ session: null, user: null, loading: false });
      return;
    }
    let mounted = true;

    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setState({ session, user: session?.user ?? null, loading: false });
    }
    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ session, user: session?.user ?? null, loading: false });
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }

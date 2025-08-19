import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import supabase from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

if (!supabase) throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify.');

type AuthState = { session: Session | null; user: User | null; loading: boolean; };
const AuthContext = createContext<AuthState>({ session: null, user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ session: null, user: null, loading: true });

  useEffect(() => {
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

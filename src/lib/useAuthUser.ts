import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase-client";

type AuthState = { user: User | null; ready: boolean };

export default function useAuthUser(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, ready: false });

  useEffect(() => {
    let ignore = false;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!ignore) setState({ user: session?.user ?? null, ready: true });
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setState({ user: session?.user ?? null, ready: true });
    });

    return () => {
      ignore = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

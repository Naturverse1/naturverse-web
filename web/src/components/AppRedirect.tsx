import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabase, SafeSupabase } from "@/lib/supabaseClient";

export default function AppRedirect() {
  const nav = useNavigate();
  useEffect(() => {
    const supabase = getSupabase() ?? (SafeSupabase as any);
    if (!supabase) { nav("/login", { replace: true }); return; }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.localStorage.setItem("naturverse-lastPath", window.location.pathname + window.location.search + window.location.hash);
      }
      nav(user ? "/profile" : "/login", { replace: true });
    });
  }, [nav]);
  return null;
}

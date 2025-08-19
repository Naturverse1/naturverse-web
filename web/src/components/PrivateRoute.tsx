import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getSupabase, SafeSupabase } from "@/lib/supabaseClient";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const supabase = getSupabase() ?? (SafeSupabase as any);
    if (!supabase) { setAuthed(false); setLoading(false); return; }
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return;
      if (!user) {
        window.localStorage.setItem("naturverse-lastPath", window.location.pathname + window.location.search + window.location.hash);
      }
      setAuthed(!!user);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{padding:32}}>Loading…</div>;
  if (!authed) return <Navigate to="/login" replace />;
  return children;
}

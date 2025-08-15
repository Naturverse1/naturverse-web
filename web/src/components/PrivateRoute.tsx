import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return;
      setAuthed(!!user);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{padding:32}}>Loading…</div>;
  if (!authed) return <Navigate to="/login" replace />;
  return children;
}

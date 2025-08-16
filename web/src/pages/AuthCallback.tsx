import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let done = false;
    (async () => {
      // Exchange URL code+state -> session
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        console.error("Auth exchange error:", error);
        navigate("/login?error=auth");
        return;
      }
      if (!done) navigate("/app", { replace: true });
    })();
    return () => { done = true; };
  }, [navigate]);

  return <div style={{ padding: 24, color: "white" }}>Signing you in…</div>;
}

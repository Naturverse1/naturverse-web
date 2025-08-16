import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Signing you in…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuth() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        // PKCE/callback flow
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          // Optionally restore lastPath
          const lastPath = window.localStorage.getItem("naturverse-lastPath");
          window.localStorage.removeItem("naturverse-lastPath");
          navigate(lastPath || "/profile", { replace: true });
        } catch (err: any) {
          setError(err.message || "Sign-in failed");
        }
        return;
      }
      // Hash-based (magic link) flow
      setStatus("Waiting for session…");
      let tries = 0;
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const lastPath = window.localStorage.getItem("naturverse-lastPath");
          window.localStorage.removeItem("naturverse-lastPath");
          navigate(lastPath || "/profile", { replace: true });
        } else if (tries < 20) {
          tries++;
          setTimeout(checkSession, 300);
        } else {
          setError("Could not sign you in. Try again.");
        }
      };
      checkSession();
    }
    handleAuth();
  }, [navigate]);

  if (error) {
    return (
      <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>Sign-in Error</h2>
        <div style={{ color: "red" }}>{error}</div>
        <a href="/login">Back to Login</a>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>{status}</h2>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";

export default function AuthCallback() {
  const nav = useNavigate();
  const [status, setStatus] = useState<'loading'|'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        await supabase.auth.getSessionFromUrl({ storeSession: true });
        nav("/app", { replace: true });
      } catch (err: any) {
        // Try to extract error from URL hash
        const hash = window.location.hash;
        let msg = err?.message || '';
        if (hash.includes('error_description')) {
          const params = new URLSearchParams(hash.replace('#', '?'));
          msg = params.get('error_description') || msg;
        }
        setErrorMsg(msg || "Sign-in link is invalid or expired. Please try again.");
        setStatus('error');
        setTimeout(() => nav("/login", { replace: true }), 2000);
      }
    }
    handleCallback();
    // eslint-disable-next-line
  }, []);

  return (
    <main style={{padding:32}}>
      <h2>Signing you in…</h2>
      {status === 'error' && <div style={{color:"red"}}>{errorMsg}</div>}
    </main>
  );
}

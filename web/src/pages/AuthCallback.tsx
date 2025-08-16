import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";

export default function AuthCallback() {
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function handleCallback() {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        setError(error.message);
        alert("Authentication failed: " + error.message);
        nav("/login", { replace: true });
      } else {
        const lastPath = localStorage.getItem("lastPath") || "/profile";
        nav(lastPath, { replace: true });
        localStorage.removeItem("lastPath");
      }
    }
    handleCallback();
    // eslint-disable-next-line
  }, []);
  return (
    <main style={{padding:32}}>
      <h2>Authenticating…</h2>
      {error && <div style={{color:"red"}}>Error: {error}</div>}
    </main>
  );
}

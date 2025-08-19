import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase, SafeSupabase } from "@/lib/supabaseClient";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const supabase = getSupabase() ?? (SafeSupabase as any);
    if (!supabase) { navigate("/login"); return; }
    (async () => {
      const url = window.location.href;
      if (url.includes("?code=")) {
        const { error } = await supabase.auth.exchangeCodeForSession(url);
        if (error) {
          alert(error.message);
          navigate("/login");
          return;
        }
      } else if (url.includes("#access_token=")) {
        const hash = new URLSearchParams(url.split('#')[1]);
        const access_token = hash.get('access_token');
        const refresh_token = hash.get('refresh_token');
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) {
            alert(error.message);
            navigate("/login");
            return;
          }
        }
      }
      window.history.replaceState({}, document.title, window.location.pathname);
      const dest = localStorage.getItem("postLoginPath") || "/";
      localStorage.removeItem("postLoginPath");
      navigate(dest);
    })();
  }, [navigate]);
  return <div style={{ padding: 32 }}>Signing you in…</div>;
};

export default AuthCallback;

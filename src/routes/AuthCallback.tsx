import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase-client";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase will consume the hash on page load and populate the session
    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth callback error:", error);
          navigate("/", { replace: true });
          return;
        }
        if (data?.session) {
          // logged in – go wherever you prefer
          navigate("/profile", { replace: true });
        } else {
          // no session; bounce home
          navigate("/", { replace: true });
        }
      } catch (e) {
        console.error("Auth callback exception:", e);
        navigate("/", { replace: true });
      }
    })();
  }, [navigate]);

  return <div style={{ padding: 24 }}>Finishing sign-in…</div>;
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase-client";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash || "";
    const finish = async () => {
      try {
        await supabase.auth.getSession();
      } catch (e) {
        // no-op; we'll still send users home
      } finally {
        window.history.replaceState({}, "", "/");
        navigate("/profile", { replace: true });
      }
    };

    if (hash.includes("access_token") || hash.includes("provider_token")) {
      finish();
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return <p style={{ padding: 24 }}>Finishing sign-in…</p>;
}

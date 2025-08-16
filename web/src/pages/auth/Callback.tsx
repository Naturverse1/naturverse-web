import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate("/profile");
      else navigate("/login");
    })();
  }, [navigate]);
  return <div style={{ padding: 32 }}>Signing in…</div>;
};

export default AuthCallback;

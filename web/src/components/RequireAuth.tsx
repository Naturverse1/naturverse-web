import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient';
export default function RequireAuth({ children }: { children: JSX.Element }) {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.localStorage.setItem("naturverse-lastPath", window.location.pathname + window.location.search + window.location.hash);
        nav("/login", { replace: true });
      } else setChecking(false);
    };
    check();
  }, [nav]);
  if (checking) return <div style={{padding:"2rem"}}>Loading…</div>;
  return children;
}

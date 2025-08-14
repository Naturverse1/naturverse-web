import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../env";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default function RequireAuth({ children }: { children: JSX.Element }) {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) nav("/login", { replace: true });
      else setChecking(false);
    };
    check();
  }, [nav]);
  if (checking) return <div style={{padding:"2rem"}}>Loading…</div>;
  return children;
}

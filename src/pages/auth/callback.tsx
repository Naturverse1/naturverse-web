import { useEffect } from "react";
import { supabase } from '@/lib/supabase-client';

export default function Callback() {
  useEffect(() => {
    supabase.auth.getSession().then(() => {
      // After OAuth or magic-link, land them somewhere happy.
      const to = sessionStorage.getItem("postAuthRedirect") || "/worlds";
      window.location.replace(to);
    });
  }, []);
  return <div style={{padding:"24px"}}>Signing you in…</div>;
}

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

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

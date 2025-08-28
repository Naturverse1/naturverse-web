import { ReactNode, useEffect, useState } from "react";
import { useSupabase } from "@/lib/useSupabase";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const supabase = useSupabase();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!supabase) { setReady(true); return; }
      const { data } = await supabase.auth.getSession();
      const ok = !!data.session;
      if (!mounted) return;
      setAuthed(ok);
      setReady(true);
      if (!ok) {
        try {
          sessionStorage.setItem("naturverse.returnTo", location.pathname + location.search);
        } catch {}
        location.replace("/login");
      }
    })();
    const { data: sub } = supabase?.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
    }) ?? { data: { subscription: { unsubscribe() {} } } };
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  if (!ready) return <div className="center-pad"><div className="spinner" /></div>;
  if (!authed) return null;
  return <>{children}</>;
}


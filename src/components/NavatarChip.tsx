import { useEffect, useState } from "react";
import { fetchNavatar, type NavatarRecord } from "@/lib/navatar";
import { supabase } from "@/supabaseClient";

export default function NavatarChip() {
  const [rec, setRec] = useState<NavatarRecord | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      if (!uid) return;
      const r = await fetchNavatar(uid);
      if (mounted) setRec(r);
    })();
    return () => { mounted = false; };
  }, []);

  if (!rec) return null;
  return (
    <a href="/navatar" aria-label="My Navatar" className="nav-chip" title="My Navatar">
      <span dangerouslySetInnerHTML={{ __html: rec.svg }} />
      <style>{`
        .nav-chip span svg{ width:32px; height:32px; display:block; }
      `}</style>
    </a>
  );
}

import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/useSupabase";
import type { User } from "@supabase/supabase-js";
import NavatarBadge from "./NavatarBadge";
import { getProfile } from "@/lib/profile";

export default function AuthButton() {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [svg, setSvg] = useState<string>();
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    let mounted = true;
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!user) { setSvg(undefined); setUrl(undefined); return; }
    const cached = localStorage.getItem('navatar_svg');
    if (cached) { setSvg(cached); setUrl(undefined); return; }
    getProfile(user.id).then(p => {
      if (p?.avatar_url) setUrl(p.avatar_url);
      if (p?.avatar_id) {
        const s = localStorage.getItem('navatar_svg');
        if (s) setSvg(s);
      }
    });
  }, [user]);

  if (loading) return <span style={{ opacity: 0.6 }}>…</span>;
  if (!user) return null;

  return (
    <a href="/profile" title="Profile" className="profile-icon">
      <NavatarBadge svg={svg} url={url} size={24} alt="Profile" />
    </a>
  );
}

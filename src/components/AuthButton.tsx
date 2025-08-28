import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/useSupabase";
import type { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const supabase = useSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <span style={{ opacity: 0.6 }}>…</span>;
  if (!user) return null;

  return (
    <a href="/profile" title="Profile" className="profile-icon">
      {user.user_metadata?.avatar_url ? (
        <img
          src={user.user_metadata.avatar_url}
          alt="Profile"
          width={24}
          height={24}
          style={{ borderRadius: "50%" }}
        />
      ) : (
        <span role="img" aria-label="profile">
          👤
        </span>
      )}
    </a>
  );
}


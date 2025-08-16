import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { fetchAvatar } from "@/lib/avatar";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? null);
      try {
        const url = await fetchAvatar(user.id);
        setAvatarUrl(url);
      } catch {
        // ignore
      }
    })();
  }, []);

  return (
    <nav className="flex items-center gap-3 p-3">
      <Link to="/">Naturverse</Link>
      <Link to="/app">App</Link>
      <Link to="/profile">Profile</Link>
      <div className="ml-auto flex items-center gap-2">
        <img
          src={avatarUrl || "/avatar-placeholder.png"}
          alt="navatar"
          className="h-8 w-8 rounded-full object-cover border border-white/10"
        />
        {email && <span className="text-xs opacity-80">{email}</span>}
      </div>
    </nav>
  );
}


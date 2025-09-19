import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import LazyImg from "./LazyImg";
import "../styles/auth-menu.css";

type MiniUser = { id: string; email: string | null; avatar_url?: string | null };

export default function AuthMenu() {
  const [user, setUser] = useState<MiniUser | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase.auth.getUser();
      const sUser = data.user;
      if (!sUser) {
        if (mounted) setUser(null);
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", sUser.id)
        .maybeSingle();

      if (mounted) {
        setUser({
          id: sUser.id,
          email: sUser.email ?? null,
          avatar_url: prof?.avatar_url ?? null,
        });
      }
    }

    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
  }

  if (!user) {
    return (
      <a className="auth-menu" href="/profile" aria-label="Sign in">
        <span className="auth-icon" aria-hidden>👤</span>
        <span className="auth-label">Sign in</span>
      </a>
    );
  }

  const initials =
    user.email?.slice(0, 1).toUpperCase() ??
    (user.id ? user.id.slice(0, 1).toUpperCase() : "?");

  return (
    <div className="auth-menu" ref={menuRef}>
      {user.avatar_url ? (
        <LazyImg
          className="auth-avatar"
          src={user.avatar_url}
          alt="Avatar"
          width={28}
          height={28}
          decoding="async"
        />
      ) : (
        <div className="auth-avatar auth-initials" aria-hidden>
          {initials}
        </div>
      )}

      <a href="/profile" className="auth-label" style={{ fontWeight: 600 }}>
        Profile
      </a>

      <button className="auth-label auth-linklike" onClick={signOut}>
        Sign out
      </button>

      <button
        className="auth-kebab"
        aria-label="Open account menu"
        onClick={() => setOpen((v) => !v)}
      >
        ⋮
      </button>

      {open && (
        <div className="auth-popover" role="menu" aria-label="Account menu">
          <a role="menuitem" href="/profile" onClick={() => setOpen(false)}>
            Profile
          </a>
          <button role="menuitem" onClick={signOut}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

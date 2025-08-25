import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import LazyImg from "./LazyImg";

type SessionUser = {
  email?: string | null;
  user_metadata?: { name?: string; full_name?: string; picture?: string };
};

function initials(name?: string, email?: string | null) {
  const n = (name || email || "U").trim();
  const parts = n.split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() || "").join("") || "U";
}

export default function UserMenu() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(data.session?.user ?? null);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => {
      mounted = false;
      document.removeEventListener("click", onDoc);
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!user) {
    return (
      <a
        className="btn"
        href="/login"
        onClick={() => {
          try {
            sessionStorage.setItem("naturverse.returnTo", window.location.pathname + window.location.search);
          } catch {}
        }}
      >
        Sign in
      </a>
    );
  }

  const name = user.user_metadata?.name || user.user_metadata?.full_name || user.email || "You";
  const pic  = user.user_metadata?.picture as string | undefined;

  return (
    <div className="usermenu" ref={ref}>
      <button className="avatar-btn" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        {pic ? <LazyImg src={pic} alt={name} /> : <span>{initials(name, user.email)}</span>}
      </button>
      {open && (
        <div className="menu">
          <div className="who">
            {pic ? <LazyImg src={pic} alt={name} /> : <span className="circle">{initials(name, user.email)}</span>}
            <div className="meta">
              <strong>{name}</strong>
              <small>{user.email}</small>
            </div>
          </div>
          <a href="/profile" className="item">Profile</a>
          <a href="/passport" className="item">Passport</a>
          <a href="/wishlist" className="item">Wishlist</a>
          <button
            className="item danger"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.replace("/");
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}


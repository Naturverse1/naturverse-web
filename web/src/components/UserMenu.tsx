import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabase } from "@/lib/supabaseClient";
import { getNavatar } from '../lib/navatar';

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [initials, setInitials] = useState<string | null>(null);
  const nav = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = getSupabase();
    setAvatar(getNavatar());
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      const name = (data.user?.user_metadata?.full_name || data.user?.email || '')
        .trim();
      if (name) {
        const parts = name.split(/\s+/);
        const init =
          parts.length > 1
            ? parts[0][0] + parts[1][0]
            : name.slice(0, 2);
        setInitials(init.toUpperCase());
      }
    });
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const signOut = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    nav('/');
  };

  return (
    <div className="menu" ref={ref}>
      <button className="menu-btn" onClick={() => setOpen(!open)}>
        {avatar ? (
          <img
            src={avatar}
            alt=""
            style={{ width: 32, height: 32, borderRadius: '50%' }}
          />
        ) : initials ? (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255,255,255,.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
            }}
          >
            {initials}
          </div>
        ) : (
          'Account'
        )}
      </button>
      {open && (
        <div className="menu-pop">
          <Link className="menu-item" to="/profile" onClick={() => setOpen(false)}>
            Profile
          </Link>
          <Link className="menu-item" to="/settings" onClick={() => setOpen(false)}>
            Settings
          </Link>
          <Link
            className="menu-item"
            to="/account/orders"
            onClick={() => setOpen(false)}
          >
            Orders
          </Link>
          <Link
            className="menu-item"
            to="/account/addresses"
            onClick={() => setOpen(false)}
          >
            Addresses
          </Link>
          <Link
            className="menu-item"
            to="/account/wishlist"
            onClick={() => setOpen(false)}
          >
            Wishlist
          </Link>
          <button className="menu-item" onClick={signOut}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}


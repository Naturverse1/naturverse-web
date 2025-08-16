import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user;
      setEmail(u?.email ?? null);
      if (!u) return;
      const { data: rows } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', u.id)
        .limit(1)
        .maybeSingle();
      setAvatarUrl(rows?.avatar_url ?? null);
    });
  }, []);

  return (
    <nav style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px' }}>
      <Link to="/">Naturverse</Link>
      <Link to="/app">App</Link>
      <Link to="/profile">Profile</Link>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {avatarUrl ? (
          <img
            src={`${avatarUrl}?t=${Date.now()}`}
            alt="Navatar"
            width={32}
            height={32}
            style={{ borderRadius: '9999px', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '9999px',
              background: '#1f2937',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              fontSize: 12,
            }}
          >
            {(email ?? 'N')[0]?.toUpperCase()}
          </div>
        )}
        {email && <span style={{ fontSize: 12, opacity: 0.8 }}>{email}</span>}
      </div>
    </nav>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/session';
import { supabase } from '@/supabaseClient';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ avatar_url: string | null; updated_at: string | null } | null>(null);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('avatar_url, updated_at')
        .eq('id', user.id)
        .single();
      setProfile(data ?? null);
    })();
  }, [user]);

  async function logout() {
    await supabase.auth.signOut();
    navigate('/', { replace: true });
  }

  const imgSrc = profile?.avatar_url
    ? `${profile.avatar_url}${profile.avatar_url.includes('?') ? '&' : '?'}v=${profile.updated_at ?? ''}`
    : '/navatar-placeholder.png';

  return (
    <nav className="nav">
      <Link to="/" className="brand">
        Naturverse
      </Link>
      <div className="spacer" />
      {user ? (
        <>
          <Link to="/app">App</Link>
          <Link to="/profile">Profile</Link>
          <img src={imgSrc} alt="Navatar" className="h-8 w-8 rounded-full object-cover" />
          <button onClick={logout}>Sign out</button>
        </>
      ) : (
        <Link to="/login">Sign in</Link>
      )}
    </nav>
  );
}

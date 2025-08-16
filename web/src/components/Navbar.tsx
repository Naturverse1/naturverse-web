import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/session';
import { supabase } from '@/supabaseClient';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      setAvatarUrl(data?.avatar_url ?? null);
    })();
  }, [user]);

  async function logout() {
    await supabase.auth.signOut();
    navigate('/', { replace: true });
  }

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
          <img
            src={avatarUrl || 'https://dummyimage.com/40x40/101a38/ffffff&text=N'}
            alt="avatar"
            style={{ width: 32, height: 32, borderRadius: '50%' }}
          />
          <button onClick={logout}>Sign out</button>
        </>
      ) : (
        <Link to="/login">Sign in</Link>
      )}
    </nav>
  );
}

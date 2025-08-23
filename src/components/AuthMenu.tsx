import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type MiniUser = { id: string; email: string | null; avatar_url?: string | null };

export default function AuthMenu() {
  const [user, setUser] = useState<MiniUser | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase.auth.getUser();
      const sUser = data.user;
      if (!sUser) {
        if (mounted) setUser(null);
        return;
      }

      // Optional profile fetch; ignore if table not present
      const { data: prof } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', sUser.id)
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

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (!user) {
    // Signed out → simple CTA; we start auth on /profile page
    return (
      <a href="/profile" style={{ fontWeight: 600 }}>
        Sign in
      </a>
    );
  }

  // Signed in → small inline menu
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt="Avatar"
          width={28}
          height={28}
          style={{ borderRadius: 6, objectFit: 'cover' }}
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <a href="/profile" style={{ fontWeight: 600 }}>
        Profile
      </a>
      <button onClick={signOut} style={{ marginLeft: 6 }}>
        Sign out
      </button>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      // 1) session
      const { data: sess } = await supabase.auth.getSession();
      const session = sess?.session ?? null;
      setEmail(session?.user?.email ?? null);

      // 2) profile row (optional)
      const uid = session?.user?.id;
      if (uid) {
        const { data } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .eq('id', uid)
          .maybeSingle();

        if (mounted) setProfile((data as Profile) ?? null);
      }

      if (mounted) setLoading(false);
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: 680, margin: '2rem auto' }}>
        <h1>Profile</h1>
        <p className="muted">Loading…</p>
      </div>
    );
  }

  if (!email) {
    return (
      <div style={{ maxWidth: 680, margin: '2rem auto' }}>
        <h1>Profile</h1>
        <p className="muted">You’re not signed in.</p>
        <a href="/login"><button>Sign in</button></a>
      </div>
    );
  }

  const avatar =
    profile?.avatar_url ||
    null; // if you store public URLs in profiles.avatar_url

  return (
    <div style={{ maxWidth: 680, margin: '2rem auto' }}>
      <h1>Profile</h1>

      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginTop: 12 }}>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 14,
            border: '1px solid #cfe3ff',
            background: '#eef6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="Avatar" width={88} height={88} style={{ objectFit: 'cover' }} />
          ) : (
            <span className="muted">No photo</span>
          )}
        </div>

        <div>
          <div style={{ fontWeight: 700 }}>{profile?.display_name || 'Explorer'}</div>
          <div className="muted" style={{ marginTop: 4 }}>{email}</div>
        </div>
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
        <a href="/"><button className="btn outline">Home</button></a>
        <button
          onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }}
        >
          Sign out
        </button>
      </div>

      <p className="muted" style={{ marginTop: 20 }}>
        Tip: store avatar URLs in <code>profiles.avatar_url</code>. This page reads it if present.
      </p>
    </div>
  );
}

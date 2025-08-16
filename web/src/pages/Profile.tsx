import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { supabase } from '@/supabaseClient';

export default function Profile() {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setAvatarUrl((data?.avatar_url as string) ?? null));
  }, [user]);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Profile</h1>
      <p>Email: {user?.email}</p>
      <img
        src={avatarUrl || '/avatar-placeholder.png'}
        alt="avatar"
        width={96}
        height={96}
        style={{ borderRadius: '50%', objectFit: 'cover', background: '#f3f3f3' }}
      />
      <div style={{ marginTop: '1rem' }}>
        <button disabled>Upload avatar (coming soon)</button>
      </div>
    </main>
  );
}

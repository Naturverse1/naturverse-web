import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/auth/session';
import { supabase } from '@/supabaseClient';
import { uploadAvatar } from '@/supabase/uploadAvatar';

export default function Profile() {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setAvatarUrl((data?.avatar_url as string) ?? null));
  }, [user]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const publicUrl = await uploadAvatar(file, user.id);
      setAvatarUrl(publicUrl);
      await supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrl });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => fileRef.current?.click();

  return (
    <main style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div
        style={{
          width: '100%',
          maxWidth: 360,
          background: 'rgba(255,255,255,0.05)',
          padding: '2rem',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <img
          src={avatarUrl || '/avatar-placeholder.png'}
          alt="avatar"
          width={96}
          height={96}
          style={{ borderRadius: '50%', objectFit: 'cover', background: '#f3f3f3' }}
        />
        <p style={{ fontWeight: 500 }}>{user?.email}</p>
        <button
          onClick={triggerFileSelect}
          disabled={uploading}
          style={{
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 9999,
            cursor: 'pointer',
            fontWeight: 600,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#2563eb')}
          onMouseLeave={e => (e.currentTarget.style.background = '#3b82f6')}
        >
          Change Avatar
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
      </div>
    </main>
  );
}

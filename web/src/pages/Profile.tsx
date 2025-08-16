import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { uploadAvatar, removeAvatarIfExists } from '@/lib/avatar';

type ProfileRow = {
  id: string;
  email: string | null;
  avatar_url: string | null;
  avatar_path: string | null; // NEW column recommended
};

export default function Profile() {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return;

      setUserId(user.id);
      setEmail(user.email ?? '');

      const { data, error: qErr } = await supabase
        .from('users')
        .select('avatar_url, avatar_path')
        .eq('id', user.id)
        .single<Pick<ProfileRow, 'avatar_url' | 'avatar_path'>>();

      if (!qErr && data) {
        setAvatarUrl(data.avatar_url ?? null);
        setAvatarPath(data.avatar_path ?? null);
      }
    })();
  }, []);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    if (!f.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert('Image too large. Please pick a file under 5 MB.');
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function onSave() {
    if (!userId || !file) return;
    try {
      setUploading(true);

      // 1) Upload new avatar
      const { publicUrl, path } = await uploadAvatar(supabase, userId, file);

      // 2) Delete previous file (use stored path if we have it)
      if (avatarPath) {
        await removeAvatarIfExists(supabase, avatarPath);
      } else if (avatarUrl) {
        await removeAvatarIfExists(supabase, avatarUrl);
      }

      // 3) Persist both public URL and storage path
      const { error: upErr } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl, avatar_path: path })
        .eq('id', userId);

      if (upErr) throw upErr;

      // 4) Update UI
      setAvatarUrl(publicUrl);
      setAvatarPath(path);
      setFile(null);
      setPreviewUrl(null);
      alert('Avatar updated!');
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? 'Failed to update avatar.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div
        style={{
          width: 420,
          maxWidth: '90vw',
          background: 'rgba(0,0,0,0.25)',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <img
          src={
            previewUrl ||
            avatarUrl ||
            'https://dummyimage.com/160x160/101a38/ffffff&text=Avatar'
          }
          alt="avatar"
          style={{
            width: 128,
            height: 128,
            borderRadius: '50%',
            display: 'block',
            margin: '0 auto 16px',
            objectFit: 'cover',
          }}
        />

        <div style={{ marginBottom: 12, opacity: 0.9 }}>{email}</div>

        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ display: 'block', margin: '0 auto 12px' }}
        />

        <button
          onClick={onSave}
          disabled={!file || uploading}
          style={{
            display: 'inline-block',
            background: uploading ? '#4b5563' : '#60a5fa',
            color: 'white',
            border: 'none',
            borderRadius: 999,
            padding: '10px 16px',
            cursor: !file || uploading ? 'not-allowed' : 'pointer',
            width: 140,
          }}
        >
          {uploading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}


import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { uploadAvatar, removeAvatarIfExists } from '@/lib/avatar';

export default function Profile() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user;
      if (!u) return;
      setUserId(u.id);
      setEmail(u.email ?? null);

      const { data: row } = await supabase
        .from('users')
        .select('avatar_url, avatar_path')
        .eq('id', u.id)
        .limit(1)
        .maybeSingle();

      setAvatarUrl(row?.avatar_url ?? null);
      setAvatarPath(row?.avatar_path ?? null);
    });
  }, []);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      alert('Please choose an image file');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert('Navatar too large (max 5 MB).');
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function onSave() {
    if (!userId || !file) return;
    setUploading(true);
    setError(null);
    try {
      const { publicUrl, path } = await uploadAvatar(supabase, userId, file);
      await removeAvatarIfExists(supabase, avatarPath ?? undefined, avatarUrl ?? undefined);

      const { error: upErr } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl, avatar_path: path, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (upErr) throw upErr;

      // refresh local state + bust cache so it appears immediately
      setAvatarUrl(`${publicUrl}?t=${Date.now()}`);
      setAvatarPath(path);
      setFile(null);
      setPreviewUrl(null);
      alert('Navatar updated');
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? 'Failed to update navatar');
      alert('Failed to update navatar');
    } finally {
      setUploading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/">Naturverse</a>
          <a href="/app">App</a>
          <a href="/profile">Profile</a>
        </div>
        <button onClick={signOut}>Sign out</button>
      </div>

      <div style={{ display: 'grid', placeItems: 'center', paddingTop: 40 }}>
        <img
          src={previewUrl ?? avatarUrl ?? '/avatar-placeholder.png'}
          alt="Navatar"
          width={128}
          height={128}
          style={{ borderRadius: '9999px', objectFit: 'cover', boxShadow: '0 10px 25px rgba(0,0,0,.25)' }}
        />
        <p style={{ marginTop: 16 }}>{email ?? ''}</p>

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <input type="file" accept="image/*" onChange={onPick} />
          <button onClick={onSave} disabled={!file || uploading}>{uploading ? 'Saving…' : 'Save Navatar'}</button>
        </div>

        {error && <p style={{ color: '#f87171', marginTop: 8 }}>{error}</p>}
      </div>
    </div>
  );
}

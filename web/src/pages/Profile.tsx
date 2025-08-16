import React, { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { uploadAvatar, removeAvatarIfExists } from '@/lib/avatar';

export default function Profile() {
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? '');

      const { data, error } = await supabase
        .from('users')
        .select('avatar_url, avatar_path')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setAvatarUrl(data.avatar_url ?? null);
        setAvatarPath(data.avatar_path ?? null);
      }
    })();
  }, []);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert('Image is larger than 5 MB.');
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f)); // instant preview
  }

  async function handleSave() {
    if (!file) return;
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not signed in.');

      // delete previous file (ignore error)
      await removeAvatarIfExists(supabase, avatarUrl ?? undefined);

      // upload new file
      const { publicUrl, path } = await uploadAvatar(supabase, user.id, file);

      // persist in DB
      const { error } = await supabase
        .from('users')
        .update({
          avatar_url: publicUrl,
          avatar_path: path,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      if (error) throw error;

      // update local state and bust cache so it shows immediately
      const busted = `${publicUrl}${publicUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
      setAvatarUrl(busted);
      setAvatarPath(path);
      setFile(null);
      setPreviewUrl(null);
      alert('Navatar updated');
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? 'Failed to update navatar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 text-center">
      <img
        src={previewUrl ?? avatarUrl ?? '/navatar-placeholder.png'}
        alt="Navatar"
        className="mx-auto mb-4 h-28 w-28 rounded-full object-cover ring-2 ring-white/20"
      />
      <p>{email}</p>
      <input
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="mt-3"
      />
      <button
        className="mt-3 rounded-md bg-sky-500 px-4 py-2 text-white disabled:opacity-50"
        onClick={handleSave}
        disabled={saving || !file}
      >
        {saving ? 'Saving…' : 'Save Navatar'}
      </button>
    </div>
  );
}

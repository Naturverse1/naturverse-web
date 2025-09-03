import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabase } from '../../lib/supabase';
import { useSession } from '../../lib/session';
import '../../styles/navatar.css';

export default function NavatarUpload() {
  const navigate = useNavigate();
  const user = useSession().user;
  const supabase = getSupabase();

  const [file, setFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [saving, setSaving] = useState(false);

  async function handleUpload() {
    if (!user?.id) return alert('Please sign in');
    if (!file) return;

    setSaving(true);
    try {
      // ensure path starts with user id and includes an extension
      const ext = (file.name.split('.').pop() || 'png').toLowerCase();
      const key = crypto.randomUUID();
      const path = `${user.id}/${key}.${ext}`;

      // upload
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || `image/${ext}`,
        });
      if (upErr) throw upErr;

      // public URL (works with our public read policy)
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const image_url = data?.publicUrl;
      if (!image_url) throw new Error('Public URL not returned');

      // save to DB
      const { error: dbErr } = await supabase
        .from('avatars')
        .upsert(
          {
            user_id: user.id,
            name: displayName || 'avatar',
            category: 'upload',
            method: 'upload',
            image_url,
          },
          { onConflict: 'user_id', ignoreDuplicates: false },
        );
      if (dbErr) throw dbErr;

      navigate('/navatar?refresh=1');
    } catch (e: any) {
      alert(e.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container">
      <nav className="nv-breadcrumbs brand-blue">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to="/navatar">Navatar</Link>
        <span className="sep">/</span>
        <span>Upload</span>
      </nav>

      <h1>Upload Navatar</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560 }}>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <input
          type="text"
          placeholder="Name (optional)"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <button className="primary" onClick={handleUpload} disabled={saving || !file}>
          {saving ? 'Saving…' : 'Upload'}
        </button>
      </div>
    </div>
  );
}


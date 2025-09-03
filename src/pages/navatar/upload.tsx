import { useState, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabase } from '../../lib/supabase';
import { useSession } from '../../lib/session';
import '../../styles/navatar.css';

export default function NavatarUpload() {
  const navigate = useNavigate();
  const { user } = useSession();
  const supabase = getSupabase();

  const [file, setFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

  async function handleUpload() {
    if (!user?.id) return alert('Please sign in');
    if (!file) return;
    setSaving(true);
    try {
      // ---- 1) upload to Storage at avatars/{userId}/{uuid}.{ext}
      const ext = (file.name.split('.').pop() || 'png').toLowerCase();
      const filename = `${crypto.randomUUID()}.${ext}`;
      const path = `${user.id}/${filename}`;

      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, {
          cacheControl: '3600',
          contentType: file.type || undefined,
          upsert: true,
        });
      if (upErr) throw upErr;

      // ---- 2) resolve a public URL for the uploaded file
      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
      const image_url = pub?.publicUrl;
      if (!image_url) throw new Error('Public URL not returned');

      // ---- 3) upsert the DB row so this becomes the current avatar
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
          { onConflict: 'user_id', ignoreDuplicates: false }
        );
      if (dbErr) throw dbErr;

      // Go back to the profile and force refresh of current avatar
      navigate('/navatar?refresh=1');
    } catch (e: any) {
      alert(e?.message || String(e));
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input type="file" accept="image/*" onChange={onFile} />
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

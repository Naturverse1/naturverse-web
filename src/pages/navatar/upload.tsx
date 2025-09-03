import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabase } from '../../lib/supabase';
import { useSession } from '../../lib/session';
import '../../styles/navatar.css';

export default function NavatarUpload() {
  const navigate = useNavigate();
  const user = useSession();
  const supabase = getSupabase();

  const [file, setFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleUpload() {
    if (!user?.id) return alert('Please sign in first');
    if (!file) return;

    setSaving(true);
    try {
      const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;

      const { error: upErr } = await supabase
        .storage
        .from('avatars')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'image/png',
        });
      if (upErr) throw upErr;

      // always read the public URL like this
      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
      const image_url = pub.publicUrl;
      if (!image_url) throw new Error('Public URL missing');

      const { error: dbErr } = await supabase
        .from('avatars')
        .upsert(
          {
            user_id: user.id,
            name: displayName || 'Navatar',
            category: 'upload',
            method: 'upload',
            image_url,
          },
          { onConflict: 'user_id', ignoreDuplicates: false }
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
    <div className="container wide">
      <nav className="nv-breadcrumbs brand-blue">
        <Link to="/">Home</Link><span className="sep">/</span>
        <Link to="/navatar">Navatar</Link><span className="sep">/</span>
        <span>Upload</span>
      </nav>

      <h1>Upload Navatar</h1>

      <div className="formStack">
        <input className="input fill" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <input className="input fill" type="text" placeholder="Name (optional)" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <button className="primary block" onClick={handleUpload} disabled={saving || !file}>
          {saving ? 'Saving…' : 'Upload'}
        </button>
      </div>
    </div>
  );
}

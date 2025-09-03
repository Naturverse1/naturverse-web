import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabase } from '../../lib/supabase-client';
import { useSession } from '../../lib/session';
import '../../styles/navatar.css';

export default function NavatarUpload() {
  const navigate = useNavigate();
  const { user } = useSession();
  const supabase = getSupabase();
  const [file, setFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleUpload() {
    if (!user?.id) return alert('Please sign in');
    if (!file) return;
    setSaving(true);
    try {
      const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
      const image_url = pub?.publicUrl;
      if (!image_url) throw new Error('Public URL not available');

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
      <div style={{display:'flex', flexDirection:'column', gap:12, maxWidth:400}}>
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        <input type="text" placeholder="Name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        <button className="primary" onClick={handleUpload} disabled={!file || saving}>
          {saving ? 'Saving…' : 'Upload'}
        </button>
      </div>
    </div>
  );
}

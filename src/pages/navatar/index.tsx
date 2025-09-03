import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { uploadNavatar } from '../../lib/avatars';
import { useSupabase } from '../../lib/useSupabase';
import '../../styles/navatar.css';

type AvatarRow = { name: string; image_url: string };
type Mode = null | 'canon' | 'upload' | 'generate';

export default function NavatarHub() {
  const supabase = useSupabase();
  const [mode, setMode] = useState<Mode>(null);
  const [current, setCurrent] = useState<AvatarRow | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { loadCurrent(); }, []);

  async function loadCurrent() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setCurrent(null); return; }
    const { data, error } = await supabase
      .from('avatars')
      .select('name,image_url')
      .eq('user_id', user.id)
      .single();
    if (!error && data) setCurrent(data as AvatarRow);
  }

  async function doUpload() {
    if (!file) return;
    setBusy(true);
    try {
      await uploadNavatar(file, name || 'avatar');
      alert('Uploaded!');
      setFile(null); setName('');
      await loadCurrent();
      setMode(null);
    } catch (e: any) {
      alert(e?.message || 'Upload failed');
    } finally { setBusy(false); }
  }

  return (
    <div className="pick-wrap">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> <span>/</span> <span>Navatar</span>
      </div>

      <h1 className="page-title">Your Navatar</h1>
      {current ? (
        <section style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src={current.image_url} alt={current.name} className="navatar-hero" />
          <h3>{current.name}</h3>
        </section>
      ) : (
        <p className="muted">No Navatar yet — pick one below.</p>
      )}

      <div className="mode-row">
        <button className="btn" onClick={() => setMode(mode === 'canon' ? null : 'canon')}>Pick Navatar</button>
        <button className="btn" onClick={() => setMode(mode === 'upload' ? null : 'upload')}>Upload</button>
        <button className="btn" onClick={() => setMode(mode === 'generate' ? null : 'generate')}>Describe &amp; Generate</button>
      </div>

      {mode === 'canon' && (
        <section className="create-block">
          <p className="muted">Choose from our characters.</p>
          <Link className="link" to="/navatar/pick">Open</Link>
        </section>
      )}

      {mode === 'upload' && (
        <section className="create-block">
          <div className="form">
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="My Navatar" />
            <label>Image</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
            <button className="btn" disabled={!file || busy} onClick={doUpload}>{busy ? 'Uploading…' : 'Upload'}</button>
          </div>
        </section>
      )}

      {mode === 'generate' && (
        <section className="create-block">
          <p className="muted">Coming next.</p>
        </section>
      )}

      {mode && (
        <div style={{ display:'flex', justifyContent:'center', marginTop:8 }}>
          <button className="btn-secondary" onClick={() => setMode(null)}>Close</button>
        </div>
      )}
    </div>
  );
}


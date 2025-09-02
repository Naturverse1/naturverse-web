import { useState } from 'react';
import { Link } from 'react-router-dom';
import { uploadNavatar } from '../../lib/avatars';
import '../../styles/navatar.css';

type Mode = null | 'canon' | 'upload' | 'generate';

export default function NavatarHub() {
  const [mode, setMode] = useState<Mode>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  async function doUpload() {
    if (!file) return;
    setBusy(true);
    try {
      await uploadNavatar(file, name || 'avatar');
      alert('Uploaded!');
      setFile(null); setName('');
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
      <p className="muted">No Navatar yet — pick one below.</p>

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


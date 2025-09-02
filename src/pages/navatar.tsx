import React, { useEffect, useState } from 'react';
import { supabase, publicAvatarUrl } from '../lib/supabase';
import canon from '../data/navatar-canon.json';
import '../styles/navatar.css';

type CanonEntry = { title: string; tags: string[]; filename: string };
type AvatarRow = { id: string; name: string | null; method: string; path: string; url: string };

class Boundary extends React.Component<any, { error?: Error }> {
  state = { error: undefined };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) return <div style={{padding:32}}>
      <h2>Something went wrong</h2>
      <pre>{this.state.error.message}</pre>
    </div>;
    return this.props.children;
  }
}

function NavatarHub() {
  const [userId, setUserId] = useState<string | null>(null);
  const [avatars, setAvatars] = useState<AvatarRow[]>([]);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'upload'|'generate'|'canon'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [name, setName] = useState('');
  const [canonPick, setCanonPick] = useState<CanonEntry | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from('avatars').select('*').order('created_at', { ascending: false });
    setAvatars(data || []);
  }

  async function remove(id: string) {
    await supabase.from('avatars').delete().eq('id', id);
    await load();
  }

  function reset() {
    setFile(null); setPrompt(''); setName(''); setCanonPick(null); setErr(null); setTab('upload');
  }

  async function handleUpload() {
    if (!file) return;
    setBusy(true); setErr(null);
    try {
      await saveUpload(file, name);
      await load();
      setOpen(false); reset();
    } catch (e:any) {
      setErr(e.message || 'Upload failed');
    } finally { setBusy(false); }
  }

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setBusy(true); setErr(null);
    try {
      const b64 = await callGenerate(prompt);
      await saveGenerated(b64, name);
      await load();
      setOpen(false); reset();
    } catch (e:any) {
      setErr(e.message || 'Failed to generate');
    } finally { setBusy(false); }
  }

  async function handleCanon() {
    if (!canonPick) return;
    setBusy(true); setErr(null);
    try {
      await insertAvatarRow({ name, method: 'canon', path: canonPick.filename, url: `/navatars/${canonPick.filename}` });
      await load();
      setOpen(false); reset();
    } catch (e:any) {
      setErr(e.message || 'Save failed');
    } finally { setBusy(false); }
  }

  async function callGenerate(prompt: string) {
    const res = await fetch('/.netlify/functions/create-navatar', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const text = await res.text();
    let data: any;
    try { data = JSON.parse(text); } catch { throw new Error('Bad JSON from server'); }
    if (!res.ok || !data?.ok) throw new Error(data?.error || 'Failed to generate');
    return data.b64 as string;
  }

  async function saveUpload(file: File, name?: string) {
    const ext = file.name.split('.').pop() || 'png';
    const path = `user-${userId}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, {
      upsert: false, contentType: file.type || 'image/png'
    });
    if (upErr) throw upErr;
    const url = publicAvatarUrl(path);
    await insertAvatarRow({ name, method: 'upload', path, url });
  }

  async function saveGenerated(b64: string, name?: string) {
    const blob = await (await fetch(`data:image/png;base64,${b64}`)).blob();
    const file = new File([blob], 'ai.png', { type: 'image/png' });
    return saveUpload(file, name);
  }

  async function insertAvatarRow(row: { name?: string; method: string; path: string; url: string; }) {
    const { error } = await supabase.from('avatars').insert({
      user_id: userId, name: row.name || null, method: row.method, path: row.path, url: row.url
    });
    if (error) throw error;
  }

  return (
    <div style={{padding:24}}>
      <h1>Your Navatars</h1>
      <button onClick={() => { setOpen(true); reset(); }}>Create Navatar</button>
      <div className="nav-list">
        {avatars.map(a => (
          <div key={a.id} className="nav-item">
            <img src={a.url} alt={a.name || a.method} style={{width:120,height:120,objectFit:'cover'}} />
            <div>{a.name || a.method}</div>
            <button onClick={() => remove(a.id)}>Delete</button>
          </div>
        ))}
      </div>

      {open && (
        <div className="nav-modal">
          <div className="nav-card">
            <div className="nav-tabs">
              <button onClick={() => setTab('upload')} className={tab==='upload'? 'active' : ''}>Upload</button>
              <button onClick={() => setTab('generate')} className={tab==='generate'? 'active' : ''}>Describe & Generate</button>
              <button onClick={() => setTab('canon')} className={tab==='canon'? 'active' : ''}>Pick Canon</button>
            </div>
            <div className="nav-body">
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name (optional)" />
              {tab === 'upload' && (
                <div className="panel">
                  <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
                  {file && <img src={URL.createObjectURL(file)} alt="preview" style={{maxWidth:'200px'}} />}
                  <button disabled={!file || busy} onClick={handleUpload}>{busy?'Saving...':'Save'}</button>
                </div>
              )}
              {tab === 'generate' && (
                <div className="panel">
                  <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Describe your Navatar" />
                  <button disabled={!prompt || busy} onClick={handleGenerate}>{busy?'Generating...':'Generate'}</button>
                  {err && <p className="error">{err}</p>}
                </div>
              )}
              {tab === 'canon' && (
                <div className="panel">
                  <div className="canon-grid">
                    {(canon as CanonEntry[]).map(c => (
                      <button key={c.filename} className={canonPick?.filename===c.filename? 'selected':''} onClick={() => setCanonPick(c)}>
                        <img src={`/navatars/${c.filename}`} alt={c.title} />
                        <div>{c.title}</div>
                      </button>
                    ))}
                  </div>
                  <button disabled={!canonPick || busy} onClick={handleCanon}>{busy?'Saving...':'Save'}</button>
                </div>
              )}
              {err && tab !== 'generate' && <p className="error">{err}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NavatarPage() {
  return <Boundary><NavatarHub /></Boundary>;
}

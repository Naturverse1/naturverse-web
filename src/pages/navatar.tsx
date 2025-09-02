import { useEffect, useState } from 'react';
import { supabase, publicAvatarUrl } from '../lib/supabase';

// Simple inline catalog (expects matching PNGs under /public/navatars/canon)
const CANON = [
  { slug: 'blu-butterfly', title: 'Blu Butterfly', src: '/navatars/canon/blu-butterfly.png' },
  { slug: 'frankie-frogs', title: 'Frankie Frogs', src: '/navatars/canon/frankie-frogs.png' },
  { slug: 'mango-mike', title: 'Mango Mike', src: '/navatars/canon/mango-mike.png' },
  { slug: 'inkie', title: 'Inkie', src: '/navatars/canon/inkie.png' }
];

interface AvatarRow {
  id: string;
  user_id: string;
  name: string | null;
  method: 'upload' | 'ai' | 'canon';
  image_path: string;
}

export default function NavatarPage() {
  const [avatars, setAvatars] = useState<AvatarRow[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState<'upload' | 'generate' | 'canon'>('upload');
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [canon, setCanon] = useState<typeof CANON[number] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data, error } = await supabase
      .from('avatars')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setAvatars(data);
  }

  async function doSave() {
    setErrorMsg('');
    setSaving(true);
    try {
      let image_path = '';
      let method: 'upload' | 'ai' | 'canon' = 'upload';

      if (tab === 'upload') {
        if (!file) throw new Error('Pick a file first');
        const ext = (file.name.split('.').pop() || 'png').toLowerCase();
        const key = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('navatars')
          .upload(key, file, { upsert: false });
        if (upErr) throw upErr;
        image_path = key;
        method = 'upload';
      } else if (tab === 'generate') {
        const res = await fetch('/.netlify/functions/create-navatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to generate');
        const png = atob(data.imageBase64);
        const buf = new Uint8Array(png.length);
        for (let i = 0; i < png.length; i++) buf[i] = png.charCodeAt(i);
        const blob = new Blob([buf], { type: 'image/png' });
        const key = `${crypto.randomUUID()}.png`;
        const { error: upErr } = await supabase.storage
          .from('navatars')
          .upload(key, blob, { upsert: false });
        if (upErr) throw upErr;
        image_path = key;
        method = 'ai';
      } else if (tab === 'canon') {
        if (!canon) throw new Error('Pick a canon');
        image_path = `canon/${canon.slug}.png`;
        method = 'canon';
      }

      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) throw new Error('Sign in first');
      const { error: insErr, data: row } = await supabase
        .from('avatars')
        .insert([
          {
            user_id: user.user.id,
            name: name || null,
            method,
            image_path
          }
        ])
        .select()
        .single();
      if (insErr) throw insErr;
      setAvatars([row, ...avatars]);
      setShowModal(false);
      setFile(null);
      setPrompt('');
      setName('');
      setCanon(null);
      setTab('upload');
    } catch (e: any) {
      setErrorMsg(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="navatar-page">
      <h1>Your Navatar</h1>
      <button className="primary" onClick={() => { setShowModal(true); setErrorMsg(''); }}>Create Navatar</button>

      <div className="grid">
        {avatars.map((a) => (
          <article key={a.id} className="card">
            <img src={publicAvatarUrl(a.image_path)} alt={a.name || a.method} />
            <h3>{a.name || a.method.toUpperCase()}</h3>
          </article>
        ))}
      </div>

      {showModal && (
        <>
          <div className="backdrop" onClick={() => setShowModal(false)}></div>
          <section className="modal" role="dialog" aria-modal="true">
            <header>
              <h2>Create Navatar</h2>
              <button className="icon" onClick={() => setShowModal(false)}>×</button>
            </header>

            <nav className="tabs">
              <button className={tab === 'upload' ? 'selected' : ''} onClick={() => setTab('upload')}>Upload</button>
              <button className={tab === 'generate' ? 'selected' : ''} onClick={() => setTab('generate')}>Describe & Generate</button>
              <button className={tab === 'canon' ? 'selected' : ''} onClick={() => setTab('canon')}>Pick Canon</button>
            </nav>

            <div className="body">
              <input placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} />

              {tab === 'upload' && (
                <>
                  <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
                  {file && <img className="preview" src={URL.createObjectURL(file)} alt="preview" />}
                </>
              )}

              {tab === 'generate' && (
                <>
                  <textarea rows={3} placeholder="e.g., funny turtle" value={prompt} onChange={e => setPrompt(e.target.value)}></textarea>
                  <small className="hint">If your OpenAI project isn’t verified for images, you’ll get a clear 403 error here.</small>
                </>
              )}

              {tab === 'canon' && (
                <div className="canon-grid">
                  {CANON.map(c => (
                    <button key={c.slug} className={`canon ${canon?.slug === c.slug ? 'selected' : ''}`} onClick={() => setCanon(c)}>
                      <img src={c.src} alt={c.title} /><span>{c.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {errorMsg && <p className="error">{errorMsg}</p>}
              <button className="primary" disabled={saving} onClick={(e) => { e.preventDefault(); doSave(); }}>Save</button>
            </div>
          </section>
        </>
      )}

      <style jsx>{`
        .navatar-page{padding:24px}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;margin:24px 0}
        .card{background:#fff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,.06);padding:12px}
        .card img{width:100%;height:auto;border-radius:10px;display:block}
        .primary{background:#2563eb;color:#fff;border:none;border-radius:10px;padding:10px 16px;font-weight:700}
        .backdrop{position:fixed;inset:0;background:rgba(0,0,0,.35)}
        .modal{position:fixed;inset:10% 50% 10% 10%;background:#fff;border-radius:14px;display:flex;flex-direction:column}
        @media (max-width:720px){.modal{inset:5%}}
        header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #eee}
        .tabs{display:flex;gap:8px;padding:12px 16px;border-bottom:1px solid #eee;flex-wrap:wrap}
        .tabs button{border-radius:999px;padding:8px 12px;border:1px solid #cfe1ff;background:#eaf2ff}
        .tabs button.selected{background:#2563eb;color:#fff;border-color:#2563eb}
        .body{padding:16px 16px 20px;overflow:auto}
        .preview{width:240px;border-radius:10px;margin-top:8px}
        .canon-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;max-height:50vh;overflow:auto}
        .canon{display:flex;flex-direction:column;gap:6px;padding:8px;border-radius:12px;border:2px solid transparent;background:#f7fafc}
        .canon.selected{border-color:#2563eb;box-shadow:0 0 0 4px rgba(37,99,235,.15)}
        .canon img{width:100%;height:auto;border-radius:10px}
        .error{color:#b91c1c;margin:8px 0 0}
        .icon{background:transparent;border:none;font-size:22px;line-height:1;padding:4px 6px}
      `}</style>
    </div>
  );
}

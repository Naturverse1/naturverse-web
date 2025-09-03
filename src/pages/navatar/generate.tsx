import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../lib/session';
import '../../styles/navatar.css';

export default function NavatarGenerate() {
  const navigate = useNavigate();
  const user = useSession();
  const [prompt, setPrompt] = useState('');
  const [srcUrl, setSrcUrl] = useState('');
  const [maskUrl, setMaskUrl] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setBusy(true);

    try {
      const res = await fetch('/.netlify/functions/generate-navatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          userId: user?.id || null,
          name: name || null,
          size: '1024x1024',
          sourceImageUrl: srcUrl || undefined,
          maskImageUrl: maskUrl || undefined,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        setErr(text || `HTTP ${res.status}`);
        return;
      }

      await res.json();
      navigate('/navatar?refresh=1');
    } catch (e: any) {
      setErr(e?.message || 'Network error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <nav className="crumbs">
        <Link to="/">Home</Link> / <Link to="/navatar">Navatar</Link> / <span>Describe &amp; Generate</span>
      </nav>

      <h1 className="h1">Describe &amp; Generate</h1>

      <form className="card card-center" onSubmit={onSubmit}>
        <textarea
          placeholder="Describe your Navatar (e.g., 'friendly water-buffalo spirit, gold robe, jungle temple, sunny morning, storybook style')"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
        />
        <input
          type="url"
          placeholder="(Optional) Source Image URL for edits/merge"
          value={srcUrl}
          onChange={e => setSrcUrl(e.target.value)}
        />
        <input
          type="url"
          placeholder="(Optional) Mask Image URL (transparent areas → replaced)"
          value={maskUrl}
          onChange={e => setMaskUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Creating...' : 'Save'}
        </button>
        {err && <p className="error">{err}</p>}
        <p className="hint">
          Tips: Keep faces centered, ask for full-body vs portrait, and mention “storybook / illustration / character sheet” for that Navatar vibe.
        </p>
      </form>
    </div>
  );
}

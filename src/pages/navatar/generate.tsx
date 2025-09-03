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
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!prompt && !srcUrl) {
      alert('Enter a prompt or a source image URL');
      return;
    }
    setSaving(true);
    try {
      const r = await fetch('/.netlify/functions/generate-navatar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          prompt,
          userId: user?.id,
          name,
          sourceImageUrl: srcUrl || undefined,
          maskImageUrl: maskUrl || undefined,
        }),
      });

      const text = await r.text(); // robust: read text first
      let data: any = {};
      try { data = text ? JSON.parse(text) : {}; } catch {
        // backend guaranteed JSON; this guards against upstream HTML errors
        throw new Error(text || 'Server returned non-JSON response');
      }

      if (!r.ok) {
        throw new Error(data?.error || 'Create failed');
      }

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
        <Link to="/">Home</Link><span className="sep">/</span>
        <Link to="/navatar">Navatar</Link><span className="sep">/</span>
        <span>Describe &amp; Generate</span>
      </nav>

      <h1>Describe &amp; Generate</h1>

      <div style={{display:'flex', flexDirection:'column', gap:12, maxWidth:720, margin:'0 auto'}}>
        <textarea
          placeholder="Describe your Navatar (e.g., ‘friendly water-buffalo spirit, gold robe, jungle temple, sunny morning, storybook style’)
"          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
          style={{width:'100%'}}
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

        <button className="primary" disabled={saving} onClick={handleSave}>
          {saving ? 'Creating…' : 'Save'}
        </button>

        <p className="hint">
          Tips: Keep faces centered, ask for full-body vs portrait, and mention “storybook / illustration / character sheet” for that Navatar vibe.
        </p>
      </div>
    </div>
  );
}


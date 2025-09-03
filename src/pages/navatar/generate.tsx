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
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  async function onSave() {
    if (saving) return;
    setSaving(true);
    try {
      if (!user?.id && !prompt && !srcUrl) {
        alert('Please sign in or provide a prompt / image.');
        return;
      }

      const res = await fetch('/.netlify/functions/generate-navatar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          prompt,
          user_id: user?.id,
          name: displayName || undefined,
          sourceImageUrl: srcUrl || undefined,
          maskImageUrl: maskUrl || undefined,
        }),
      });

      let payload: any = null;
      const txt = await res.text();
      try { payload = txt ? JSON.parse(txt) : null; } catch { /* noop */ }

      if (!res.ok) {
        throw new Error(payload?.error || 'Create failed');
      }

      const image_url = payload?.image_url;
      if (!image_url) throw new Error('No image_url returned.');

      navigate('/navatar?refresh=1');
    } catch (e: any) {
      alert(e.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container wide">
      <nav className="nv-breadcrumbs brand-blue">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to="/navatar">Navatar</Link>
        <span className="sep">/</span>
        <span>Describe &amp; Generate</span>
      </nav>

      <h1>Describe &amp; Generate</h1>

      <div className="formStack nv-form">
        <textarea
          className="input fill"
          rows={4}
          placeholder="Describe your Navatar (e.g., 'friendly water-buffalo spirit, gold robe, jungle temple, sunny morning, storybook style')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <input
          className="input fill"
          placeholder="(Optional) Source Image URL for edits/merge"
          value={srcUrl}
          onChange={(e) => setSrcUrl(e.target.value)}
        />
        <input
          className="input fill"
          placeholder="(Optional) Mask Image URL (transparent areas → replaced)"
          value={maskUrl}
          onChange={(e) => setMaskUrl(e.target.value)}
        />
        <input
          className="input fill"
          placeholder="Name (optional)"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <button className="primary block" onClick={onSave} disabled={saving}>
          {saving ? 'Creating…' : 'Save'}
        </button>
      </div>

      <p className="hint">
        Tips: Keep faces centered, ask for full-body vs portrait, and mention “storybook / illustration /
        character sheet” for that Navatar vibe.
      </p>
    </div>
  );
}


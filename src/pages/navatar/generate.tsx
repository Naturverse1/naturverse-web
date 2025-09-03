import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../lib/session';
import '../../styles/navatar.css';

export default function NavatarGenerate() {
  const navigate = useNavigate();
  const user = useSession();

  const [prompt, setPrompt] = useState('');
  const [sourceImageUrl, setSourceImageUrl] = useState('');
  const [maskImageUrl, setMaskImageUrl] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleGenerate() {
    try {
      if (!user?.id) return alert('Please sign in');
      if (!prompt && !sourceImageUrl) return alert('Enter a prompt or source image');

      setSaving(true);
      const res = await fetch('/.netlify/functions/generateNavatar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          prompt,
          name: displayName,
          sourceImageUrl: sourceImageUrl || undefined,
          maskImageUrl: maskImageUrl || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Generate failed');

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
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to="/navatar">Navatar</Link>
        <span className="sep">/</span>
        <span>Describe &amp; Generate</span>
      </nav>

      <h1>Describe &amp; Generate</h1>

      <div className="formStack">
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
          value={sourceImageUrl}
          onChange={(e) => setSourceImageUrl(e.target.value)}
        />
        <input
          className="input fill"
          placeholder="(Optional) Mask Image URL (transparent areas → replaced)"
          value={maskImageUrl}
          onChange={(e) => setMaskImageUrl(e.target.value)}
        />
        <input
          className="input fill"
          placeholder="Name (optional)"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <button className="primary block" onClick={handleGenerate} disabled={saving}>
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


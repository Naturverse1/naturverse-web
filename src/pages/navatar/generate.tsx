// src/pages/navatar/generate.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../lib/session';
import '../../styles/navatar.css'; // keeps your shared styles

export default function NavatarGenerate() {
  const navigate = useNavigate();
  const user = useSession();

  const [prompt, setPrompt] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [maskUrl, setMaskUrl] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!prompt && !sourceUrl) {
      alert('Please add a description or a source image URL.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/.netlify/functions/generate-navatar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          prompt,
          user_id: user?.id,
          name,
          sourceImageUrl: sourceUrl || undefined,
          maskImageUrl: maskUrl || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || 'Failed to create Navatar.');
      }

      // After success, bounce back to /navatar to show
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
        <span>Describe &amp; Generate</span>
      </nav>

      <h1>Describe &amp; Generate</h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 840,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <textarea
          placeholder={`Describe your Navatar (e.g., 'friendly water-buffalo spirit, gold robe, jungle temple, sunny morning, storybook style')`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '100%', minHeight: 100 }}
        />
        <input
          type="url"
          placeholder="(Optional) Source Image URL for edits/merge"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          style={{ width: '100%' }}
        />
        <input
          type="url"
          placeholder="(Optional) Mask Image URL (transparent areas → replaced)"
          value={maskUrl}
          onChange={(e) => setMaskUrl(e.target.value)}
          style={{ width: '100%' }}
        />
        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%' }}
        />

        <button className="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Creating...' : 'Save'}
        </button>

        <div
          style={{
            fontSize: 14,
            opacity: 0.8,
            border: '2px dashed #d5d9e3',
            padding: 12,
            borderRadius: 8,
          }}
        >
          Tips: Keep faces centered, ask for full-body vs portrait, and mention
          <em> “storybook / illustration / character sheet” </em>
          for that Navatar vibe.
        </div>
      </div>
    </div>
  );
}

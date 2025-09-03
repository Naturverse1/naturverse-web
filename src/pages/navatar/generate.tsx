import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../../lib/session';
import { generateNavatar } from '../../lib/openai';
import '../../styles/navatar.css';

export default function NavatarGenerate() {
  const navigate = useNavigate();
  const user = useSession();
  const [prompt, setPrompt] = useState('');
  const [name, setName] = useState('');
  const [srcUrl, setSrcUrl] = useState('');
  const [maskUrl, setMaskUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const disabled = saving || !prompt.trim();

  async function onSave() {
    if (!user?.id) return alert('Please sign in');
    setSaving(true);
    try {
      const { image_url } = await generateNavatar({
        prompt,
        sourceImageUrl: srcUrl || undefined,
        maskImageUrl: maskUrl || undefined,
        name: name || undefined
      });
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

      <div style={{display:'flex', flexDirection:'column', gap:12, maxWidth:640}}>
        <textarea
          value={prompt}
          onChange={e=>setPrompt(e.target.value)}
          placeholder="Describe your Navatar (e.g., 'friendly water-buffalo spirit, gold robe, jungle temple, sunny morning, storybook style')"
          rows={4}
        />
        <input value={srcUrl} onChange={e=>setSrcUrl(e.target.value)}
               placeholder="(Optional) Source Image URL for edits/merge" />
        <input value={maskUrl} onChange={e=>setMaskUrl(e.target.value)}
               placeholder="(Optional) Mask Image URL (transparent areas = replaced)" />
        <input value={name} onChange={e=>setName(e.target.value)}
               placeholder="Name (optional)" />
        <button className="primary" disabled={disabled} onClick={onSave}>
          {saving ? 'Creating…' : 'Save'}
        </button>
      </div>

      <p style={{marginTop:16, opacity:.7}}>
        Tips: Keep faces centered, ask for full-body vs portrait, and mention
        “storybook / illustration / character sheet” for that Navatar vibe.
      </p>
    </div>
  );
}

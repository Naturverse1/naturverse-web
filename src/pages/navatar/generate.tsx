import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import './navatar.css';

export default function NavatarGeneratePage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [maskUrl, setMaskUrl] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/.netlify/functions/generate-navatar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt || undefined,
          user_id: user?.id,
          name: name || undefined,
          sourceImageUrl: sourceUrl || undefined,
          maskImageUrl: maskUrl || undefined,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      // success — go back to /navatar and let it fetch the fresh image
      window.location.href = '/navatar?refresh=1';
    } catch (err: any) {
      alert(err?.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="nv-wrap">
      <h1 className="nv-title">Describe &amp; Generate</h1>

      <form className="nv-form" onSubmit={onSave}>
        <textarea
          className="nv-input"
          placeholder="Describe your Navatar (e.g., ‘friendly water-buffalo spirit, gold robe, temple, sunny morning, storybook style’ )"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />

        <input
          className="nv-input"
          placeholder="(Optional) Source Image URL for edits/merge"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
        />

        <input
          className="nv-input"
          placeholder="(Optional) Mask Image URL (transparent areas → replaced)"
          value={maskUrl}
          onChange={(e) => setMaskUrl(e.target.value)}
        />

        <input
          className="nv-input"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="nv-btn" type="submit" disabled={saving}>
          {saving ? 'Creating…' : 'Save'}
        </button>

        <p className="nv-hint">
          Tips: Keep faces centered, ask for full-body vs portrait, and mention “storybook / illustration / character sheet” for that Navatar vibe.
        </p>
      </form>
    </div>
  );
}


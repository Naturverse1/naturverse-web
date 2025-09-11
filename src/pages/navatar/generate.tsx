import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavatarBreadcrumbs from '../../components/NavatarBreadcrumbs';
import '../../styles/navatar.css';
import { uploadAndInsertAvatar, pickActiveAvatar } from '../../lib/navatar';
import { useAuth } from '../../lib/auth-context';

export default function GenerateNavatarPage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [draftUrl, setDraftUrl] = useState<string | undefined>();
  const nav = useNavigate();

  useEffect(() => {
    if (!file) { setDraftUrl(undefined); return; }
    const url = URL.createObjectURL(file);
    setDraftUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!user) return <div className="navatar-shell"><p>Please sign in.</p></div>;

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    try {
      const row = await uploadAndInsertAvatar(user!.id, file, name || undefined);
      await pickActiveAvatar(user!.id, row.id);
      alert('Saved ✓');
      nav('/navatar');
    } catch {
      alert('Save failed');
    }
  }

  return (
    <div className="navatar-shell">
      <NavatarBreadcrumbs />
      <h1>Describe &amp; Generate</h1>
      <form
        onSubmit={onSave}
        className="center"
        style={{ maxWidth: 520, margin: '16px auto', display: 'grid', justifyItems: 'center', gap: 12 }}
      >
        {draftUrl && (
          <div className="card-300">
            <img src={draftUrl} alt="preview" />
          </div>
        )}
        <textarea
          rows={4}
          placeholder="Describe your Navatar (e.g., friendly water-buffalo spirit)…"
          style={{ width: '100%' }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <input
          style={{ display: 'block', width: '100%' }}
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button className="pill" type="submit" style={{ marginTop: 8 }}>
          Save
        </button>
      </form>
      <p className="center" style={{ opacity: 0.8 }}>
        AI art & edit coming soon.
      </p>
    </div>
  );
}

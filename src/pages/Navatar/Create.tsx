import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/navatar.css';
import { saveNavatar } from '../../lib/navatar';

const defaultBackstory =
  'Born in the animal realm, this Animal learned to help explorers by trading smiles for smiles. Their quest: protect habitats and cheer on friends across the 14 kingdoms.';

export default function Create() {
  const [baseType, setBaseType] = useState<'Animal' | 'Fruit' | 'Insect' | 'Spirit'>('Animal');
  const [name, setName] = useState('');
  const [backstory, setBackstory] = useState(defaultBackstory);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      await saveNavatar({ name, base_type: baseType, backstory, file });
      nav('/navatar');
    } catch (e: any) {
      setError(e.message ?? 'Could not save Navatar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="nv-wrap">
      <nav className="nv-breadcrumb">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Create</span>
      </nav>

      <h1 className="nv-h1">Navatar Creator</h1>

      <form onSubmit={onSubmit} className="nv-section">
        <h2 className="nv-h2">1) Pick a Base</h2>
        <div className="nv-top-tabs" role="tablist" aria-label="Base type">
          <div className="nv-top-tabs-scroll">
            {(['Animal', 'Fruit', 'Insect', 'Spirit'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setBaseType(t)}
                className={'nv-pill' + (baseType === t ? ' nv-pill-active' : '')}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <section className="nv-section">
          <label>
            Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Backstory
            <textarea value={backstory} onChange={(e) => setBackstory(e.target.value)} />
          </label>
          <label>
            Photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </section>

        <section className="nv-section">
          <h2 className="nv-h2">Character Card</h2>
          <figure className="nv-hero">
            {previewUrl ? (
              <img className="nv-img" src={previewUrl} alt={name || baseType || 'Navatar'} />
            ) : (
              <div className="nv-ph">No photo</div>
            )}
          </figure>

          <div className="nv-card-meta">
            <div className="nv-card-title">{name || baseType || 'Navatar'}</div>
            <div className="nv-card-sub">
              {(baseType || '—') + ' · ' + new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="nv-card-meta">
            <div className="nv-card-title">Species</div>
            <div className="nv-card-sub">{baseType}</div>
          </div>
          <div className="nv-card-meta">
            <div className="nv-card-title">Backstory</div>
            <div className="nv-card-sub">{backstory}</div>
          </div>
        </section>

        {error && <p className="nv-muted">{error}</p>}
        <div className="nv-section">
          <button className="nv-pill nv-pill-active" disabled={saving}>
            {saving ? 'Saving…' : 'Save Navatar'}
          </button>
        </div>
      </form>
    </main>
  );
}

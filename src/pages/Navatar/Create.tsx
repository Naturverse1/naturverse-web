import { FormEvent, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const navigate = useNavigate();

  async function handleSaveNavatar(e: FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      await saveNavatar({ name, base_type: baseType, backstory, file });
      navigate('/navatar');
    } catch (e: any) {
      setError(e.message ?? 'Could not save Navatar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="nv-section">
      <nav className="nv-breadcrumb nv-subcrumb">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Create</span>
      </nav>

      <h2 className="nv-h2">Navatar Creator</h2>

      <form onSubmit={handleSaveNavatar}>
        <label>
          Base Type
          <select value={baseType} onChange={(e) => setBaseType(e.target.value as any)}>
            {(['Animal', 'Fruit', 'Insect', 'Spirit'] as const).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

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

        {error && <p className="nv-muted">{error}</p>}

        <button className="nv-btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save Navatar'}
        </button>
      </form>

      <h3 className="nv-h3">Character Card</h3>
      <figure className="nv-hero">
        {previewUrl ? (
          <img className="nv-img" src={previewUrl} alt="Navatar preview" />
        ) : (
          <div className="nv-ph">No photo</div>
        )}
      </figure>
    </section>
  );
}

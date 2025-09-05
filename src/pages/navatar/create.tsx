import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { createNavatar, getSession, NavatarType } from '../../lib/navatar';

const TYPES: NavatarType[] = ['Animal', 'Fruit', 'Insect', 'Spirit'];

function defaultBackstory(type: NavatarType) {
  return `Born in the ${type.toLowerCase()} realm, this ${type} learned to help explorers by trading smiles and stories across the 14 kingdoms.`;
}

export default function NavatarCreate() {
  const nav = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => { getSession().then(s => setAuthed(!!s)); }, []);

  const [type, setType] = useState<NavatarType>('Animal');
  const [name, setName] = useState('');
  const [backstory, setBackstory] = useState(defaultBackstory('Animal'));
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setBackstory(defaultBackstory(type)); }, [type]);

  const canSave = useMemo(() => authed && backstory.trim().length > 0 && !saving, [authed, backstory, saving]);

  async function onSave() {
    if (!canSave) return;
    try {
      setSaving(true);
      await createNavatar({ name: name.trim() || undefined, type, backstory: backstory.trim(), file });
      nav('/navatar');
    } catch (e) {
      console.error(e);
      alert('Could not save Navatar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="wrap">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Navatar', href: '/navatar' }, { label: 'Create' }]} />
      <h1>Create Navatar</h1>

      {!authed && (
        <div className="sign-in-nudge">Please sign in to create and save a Navatar.</div>
      )}

      <section className="creator">
        <div className="left">
          <h3>1) Pick a base</h3>
          <div className="chips">
            {TYPES.map(t => (
              <button
                key={t}
                className={`chip ${type === t ? 'active' : ''}`}
                onClick={() => setType(t)}
              >{t}</button>
            ))}
          </div>

          <h3>2) Details</h3>
          <label className="lbl">Name (optional)</label>
          <input placeholder={`${type}...`} value={name} onChange={e => setName(e.target.value)} />

          <label className="lbl">Backstory</label>
          <textarea rows={6} value={backstory} onChange={e => setBackstory(e.target.value)} />

          <label className="lbl">Photo (optional)</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />

          <div className="row">
            <button className="btn secondary" type="button" onClick={() => setBackstory(defaultBackstory(type))}>
              Randomize
            </button>
            <button className="btn" disabled={!canSave} onClick={onSave}>
              {saving ? 'Saving…' : 'Save Navatar'}
            </button>
          </div>
        </div>

        <div className="card-preview">
          <div className="preview">
            <div className="title">{name || type} <span className="dot">•</span> {type}</div>
            <div className="photo">{file ? <img src={URL.createObjectURL(file)} /> : <div className="no-photo">No photo</div>}</div>
            <p className="story">{backstory}</p>
          </div>
        </div>
      </section>
    </main>
  );
}


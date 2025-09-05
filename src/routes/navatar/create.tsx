import { FormEvent, useMemo, useState } from 'react';
import { insertNavatar, NavatarBase, uploadNavatarImage } from '../../lib/navatar';
import { useSession } from '../../lib/useSession';

const BASES: NavatarBase[] = ['Animal','Fruit','Insect','Spirit'];

export default function CreateNavatar() {
  const { user } = useSession();
  const [base, setBase] = useState<NavatarBase>('Animal');
  const [name, setName] = useState<string>('');
  const [backstory, setBackstory] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const placeholderStory = useMemo(() =>
    `Born in the ${base.toLowerCase()} realm, this ${name || base} learned to help explorers by trading smiles for smiles. Their quest: protect habitats and cheer on friends across the 14 kingdoms.`,
  [base, name]);

  function onPickFile(f?: File) {
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return setMsg('Please sign in first.');
    setSaving(true);
    setMsg(null);
    try {
      let imageUrl: string | null = null;
      if (file) imageUrl = await uploadNavatarImage(user.id, file);
      await insertNavatar({
        userId: user.id,
        name: name || null,
        base_type: base,
        backstory: (backstory || placeholderStory),
        image_url: imageUrl
      });
      setMsg('Saved! Returning to Navatar…');
      window.location.assign('/navatar');
    } catch (err: any) {
      setMsg(`Could not save: ${err.message ?? err}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <div className="crumbs">Home / Navatar / Create</div>
      <h1>Navatar Creator</h1>
      <p>Choose a base type, customize details, and save your character card.</p>

      <form className="creator" onSubmit={onSubmit}>
        <section className="panel">
          <h3>1) Pick a Base</h3>
          <div className="chip-row">
            {BASES.map(b => (
              <button
                type="button"
                key={b}
                className={`chip ${b===base?'active':''}`}
                onClick={() => setBase(b)}
              >{b}</button>
            ))}
          </div>

          <h3>2) Details</h3>
          <label>Name (optional)</label>
          <input
            inputMode="text"
            minLength={0}
            placeholder={`${base}…`}
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <label>Backstory</label>
          <textarea
            rows={5}
            value={backstory || placeholderStory}
            onChange={e => setBackstory(e.target.value)}
          />

          <label>Photo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => onPickFile(e.target.files?.[0] ?? undefined)}
          />

          <div className="row">
            <button type="button" className="btn secondary" onClick={()=>{
              setName(''); setBackstory(''); setFile(null); setPreviewUrl(null);
            }}>Randomize</button>
            <button className="btn" disabled={saving}>{saving?'Saving…':'Save Navatar'}</button>
          </div>

          {msg && <p className="notice">{msg}</p>}
        </section>

        <aside className="card preview">
          <h3>Character Card</h3>
          <div className="frame">
            {previewUrl ? (
              <img src={previewUrl} alt="preview" />
            ) : (
              <div className="img-empty">No photo</div>
            )}
          </div>
          <div className="meta-columns">
            <div>
              <div className="k">Species</div>
              <div className="v">{name || base}</div>
            </div>
            <div>
              <div className="k">Powers</div>
              <div className="v">Puzzle Vision · Nature Whisper · Leaf Shield</div>
            </div>
          </div>
          <div className="k">Backstory</div>
          <div className="v">{backstory || placeholderStory}</div>
        </aside>
      </form>
    </div>
  );
}

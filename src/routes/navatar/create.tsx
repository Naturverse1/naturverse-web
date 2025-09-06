import { FormEvent, useMemo, useState } from "react";
import { saveNavatar, navatarImageUrl } from "../../lib/navatar";
import { Link, useNavigate } from "react-router-dom";

const defaultBackstory =
  "Born in the animal realm, this Animal learned to help explorers by trading smiles for smiles. Their quest: protect habitats and cheer on friends across the 14 kingdoms.";

export default function NavatarCreate() {
  const [baseType, setBaseType] = useState<"Animal"|"Fruit"|"Insect"|"Spirit">("Animal");
  const [name, setName] = useState("");
  const [backstory, setBackstory] = useState(defaultBackstory);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const localPreview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      const row = await saveNavatar({ name, base_type: baseType, backstory, file });
      // Success -> go back to list
      nav("/navatar");
    } catch (e: any) {
      setError(e.message ?? "Could not save Navatar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="Page">
      <nav className="Breadcrumbs">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Create</span>
      </nav>

      <h1>Navatar Creator</h1>
      <p>Choose a base type, customize details, and save your character card.</p>

      <form className="CreatorGrid" onSubmit={onSubmit}>
        <section className="FormCard">
          <h3>1) Pick a Base</h3>
          <div className="ChipRow">
            {(["Animal","Fruit","Insect","Spirit"] as const).map(t => (
              <button
                key={t}
                type="button"
                className={`Chip ${baseType === t ? "active": ""}`}
                onClick={() => setBaseType(t)}
              >{t}</button>
            ))}
          </div>

          <h3>2) Details</h3>

          <label>Name (optional)
            <input inputMode="text" minLength={0} maxLength={40}
                   value={name} onChange={e=>setName(e.target.value)} />
          </label>

          <label>Backstory <span className="muted">(optional)</span>
            <textarea value={backstory} onChange={e=>setBackstory(e.target.value)} />
          </label>

          <label>Photo <span className="muted">(optional)</span>
            <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
          </label>

          {error && <p className="Error">{error}</p>}
          <div className="Row">
            <button className="Button primary" disabled={saving}>{saving ? "Saving…" : "Save Navatar"}</button>
          </div>
        </section>

        <aside className="PreviewCard">
          <h3>Character Card</h3>
          <div className="CardCanvas">
            {localPreview ? <img src={localPreview} alt="Preview" /> : <div className="NoPhoto">No photo</div>}
          </div>
          <div className="PreviewMeta">
            <div className="Title">{name || baseType}</div>
            <div className="Sub">{baseType} • {new Date().toLocaleDateString()}</div>
          </div>
          <div className="PreviewBody">
            <dl>
              <dt>Species</dt><dd>{name || baseType}</dd>
              <dt>Backstory</dt><dd>{backstory}</dd>
            </dl>
          </div>
        </aside>
      </form>
    </div>
  );
}


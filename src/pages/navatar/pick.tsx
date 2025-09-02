import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listNavatars, saveNavatarSelection, NavatarItem } from "../../lib/navatar";
import "../../styles/navatar.css";

export default function NavatarPick() {
  const [items, setItems] = useState<NavatarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<NavatarItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const files = await listNavatars();
      setItems(files);
      setLoading(false);
    })();
  }, []);

  async function onSave() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await saveNavatarSelection(selected.url);
      setSaved(true);
      alert("Navatar saved!");
    } catch (e: any) {
      setError(e?.message || "Error saving Navatar");
      alert("Error saving Navatar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="nv-container">
      <nav className="nv-crumbs">
        <Link to="/">Home</Link> <span>/</span>
        <Link to="/navatar">Navatar</Link> <span>/</span>
        <span>Pick</span>
      </nav>

      <h1 className="nv-title">Pick Navatar</h1>

      {loading && <p className="nv-muted">Loading characters…</p>}
      {!loading && items.length === 0 && (
        <p className="nv-muted">No characters found in Supabase bucket <code>navatars</code>.</p>
      )}

      {!loading && items.length > 0 && (
        <>
          <div className="nv-grid" role="list" aria-label="Navatar catalog">
            {items.map((it) => (
              <button
                key={it.name}
                type="button"
                className={`nv-card nv-pick ${selected?.name === it.name ? "selected" : ""}`}
                onClick={() => setSelected(it)}
              >
                <img loading="lazy" src={it.url} alt={it.name} />
                <div className="nv-pick-name">{it.name.replace(/\.[a-zA-Z0-9]+$/, "")}</div>
              </button>
            ))}
          </div>

          <div className="nv-actions">
            <button
              className="nv-primary"
              disabled={!selected || saving}
              onClick={onSave}
            >
              {saving ? "Saving…" : selected ? `Save “${selected.name.replace(/\.[a-zA-Z0-9]+$/, "")}”` : "Pick one to save"}
            </button>
            {saved && <span className="nv-ok">Saved!</span>}
            {error && <span className="nv-err">{error}</span>}
          </div>
        </>
      )}
    </div>
  );
}


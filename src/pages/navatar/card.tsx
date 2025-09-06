import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarPills from "../../components/NavatarPills";
import { loadPrimaryNavatarId, loadCard, saveCard } from "../../lib/navatarCard";
import "../../styles/navatar.css";

type Form = {
  name: string;
  species: string;
  kingdom: string;
  backstory: string;
  powers: string;
  traits: string;
};

export default function NavatarCardPage() {
  const [navatarId, setNavatarId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>({
    name: "",
    species: "",
    kingdom: "",
    backstory: "",
    powers: "",
    traits: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const id = await loadPrimaryNavatarId();
      setNavatarId(id);
      if (!id) return;
      const card = await loadCard(id);
      if (card) {
        setForm({
          name: card.name ?? "",
          species: card.species ?? "",
          kingdom: card.kingdom ?? "",
          backstory: card.backstory ?? "",
          powers: (card.powers ?? []).join(", "),
          traits: (card.traits ?? []).join(", "),
        });
      }
    })();
  }, []);

  const onChange = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!navatarId) {
      alert("Please create or select a Navatar first.");
      return;
    }
    setSaving(true);
    try {
      await saveCard({
        navatar_id: navatarId,
        name: form.name || null,
        species: form.species || null,
        kingdom: form.kingdom || null,
        backstory: form.backstory || null,
        powers: form.powers
          ? form.powers.split(",").map(s => s.trim()).filter(Boolean)
          : [],
        traits: form.traits
          ? form.traits.split(",").map(s => s.trim()).filter(Boolean)
          : [],
      });
      alert("Saved ✓");
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Error saving card");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Card" }]} />
      <h1 className="center" style={{ color: "var(--nv-blue-900)" }}>Character Card</h1>
      <NavatarPills active="card" color="blue" />
      <form
        onSubmit={onSave}
        style={{ maxWidth: 720, margin: "16px auto", display: "grid", gap: 12, color: "var(--nv-blue-900)" }}
      >
        <label>
          Name
          <input className="nv-input" value={form.name} onChange={onChange("name")} />
        </label>

        <label>
          Species / Type
          <input className="nv-input" value={form.species} onChange={onChange("species")} />
        </label>

        <label>
          Kingdom
          <input className="nv-input" value={form.kingdom} onChange={onChange("kingdom")} />
        </label>

        <label>
          Backstory
          <textarea className="nv-input" rows={6} value={form.backstory} onChange={onChange("backstory")} />
        </label>

        <label>
          Powers (comma separated)
          <input className="nv-input" value={form.powers} onChange={onChange("powers")} />
        </label>

        <label>
          Traits (comma separated)
          <input className="nv-input" value={form.traits} onChange={onChange("traits")} />
        </label>

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Link to="/navatar" className="nv-btn-outline">Back to My Navatar</Link>
          <button className="nv-btn" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}

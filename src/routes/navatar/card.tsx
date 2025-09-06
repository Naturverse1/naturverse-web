import { useEffect, useState } from "react";
import HubPills from "../../components/HubPills";
import { getMyNavatar, saveCard, loadCard } from "../../lib/navatar";
import "../../styles/navatar.css";

export default function NavatarCardPage() {
  const [primary, setPrimary] = useState<any>(null);
  const [form, setForm] = useState<any>({
    name: "",
    species: "",
    kingdom: "",
    backstory: "",
    powers: "",
    traits: "",
  });

  useEffect(() => {
    (async () => {
      const p = await getMyNavatar();
      setPrimary(p);
      if (p) {
        const c = await loadCard(p.id);
        if (c) {
          setForm({
            name: c.name ?? "",
            species: c.species ?? "",
            kingdom: c.kingdom ?? "",
            backstory: c.backstory ?? "",
            powers: (c.powers ?? []).join(", "),
            traits: (c.traits ?? []).join(", "),
          });
        }
      }
    })();
  }, []);

  const onSave = async (e: any) => {
    e.preventDefault();
    if (!primary) return;
    await saveCard({
      navatar_id: primary.id,
      name: form.name || null,
      species: form.species || null,
      kingdom: form.kingdom || null,
      backstory: form.backstory || null,
      powers: form.powers
        ? form.powers.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
      traits: form.traits
        ? form.traits.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
    });
    alert("Saved ✓");
  };

  return (
    <div className="container">
      <HubPills /> {/* pills are auto-hidden on mobile for sub-pages */}
      <h1>Character Card</h1>

      <div className="two-col">
        <div className="card-panel">
          <h3 style={{ textAlign: "center" }}>My Navatar</h3>
          <hr />
          <p>
            <strong>Backstory</strong>
            <br />
            {form.backstory || "No backstory yet."}
          </p>
          <p>
            <strong>Powers</strong>
            <br />
            {form.powers || "—"}
          </p>
          <p>
            <strong>Traits</strong>
            <br />
            {form.traits || "—"}
          </p>
        </div>

        <form onSubmit={onSave} className="form">
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Species / Type
            <input
              value={form.species}
              onChange={(e) => setForm({ ...form, species: e.target.value })}
            />
          </label>
          <label>
            Kingdom
            <input
              value={form.kingdom}
              onChange={(e) => setForm({ ...form, kingdom: e.target.value })}
            />
          </label>
          <label>
            Backstory
            <textarea
              rows={5}
              value={form.backstory}
              onChange={(e) => setForm({ ...form, backstory: e.target.value })}
            />
          </label>
          <label>
            Powers (comma separated)
            <input
              value={form.powers}
              onChange={(e) => setForm({ ...form, powers: e.target.value })}
            />
          </label>
          <label>
            Traits (comma separated)
            <input
              value={form.traits}
              onChange={(e) => setForm({ ...form, traits: e.target.value })}
            />
          </label>
          <button type="submit" className="btn primary">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}


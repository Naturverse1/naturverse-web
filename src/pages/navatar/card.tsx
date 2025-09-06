import { useMemo, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { loadActive } from "../../lib/localStorage";
import { upsertMyCharacterCard, fetchMyCharacterCard } from "../../lib/navatar";
import "../../styles/navatar.css";

export default function CardPage() {
  const nav = useNavigate();
  const active = useMemo(() => loadActive<any>(), []);
  const [form, setForm] = useState({
    name: "",
    species: "",
    kingdom: "",
    backstory: "",
    powers: "",
    traits: "",
  });

  useEffect(() => {
    let alive = true;
    if (active?.id) {
      fetchMyCharacterCard(active.id)
        .then(card => {
          if (card && alive) {
            setForm({
              name: card.name ?? "",
              species: card.species ?? "",
              kingdom: card.kingdom ?? "",
              backstory: card.backstory ?? "",
              powers: (card.powers ?? []).join(", "),
              traits: (card.traits ?? []).join(", "),
            });
          }
        })
        .catch(() => {});
    }
    return () => {
      alive = false;
    };
  }, [active?.id]);

  if (!active) {
    return (
      <main className="container page-pad">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Card" }]} />
        <h1 className="center page-title">Character Card</h1>
        <NavatarTabs color="blue" />
        <p>
          You don’t have an active Navatar. <Link to="/navatar/pick">Pick</Link> or
          <Link to="/navatar/upload">Upload</Link> one first.
        </p>
      </main>
    );
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await upsertMyCharacterCard(active.id, {
        ...form,
        powers: form.powers
          ? form.powers.split(",").map(s => s.trim()).filter(Boolean)
          : [],
        traits: form.traits
          ? form.traits.split(",").map(s => s.trim()).filter(Boolean)
          : [],
      });
      nav("/navatar/mint");
    } catch (err: any) {
      alert(err?.message ?? "Save failed");
    }
  }

  return (
    <main className="container page-pad">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Card" }]} />
      <h1 className="center page-title">Character Card</h1>
      <NavatarTabs color="blue" />
      <form className="form-card" onSubmit={onSave} style={{ margin: "16px auto" }}>
        <label>
          Name
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label>
          Species / Type
          <input
            value={form.species}
            onChange={e => setForm({ ...form, species: e.target.value })}
          />
        </label>

        <label>
          Kingdom
          <input
            value={form.kingdom}
            onChange={e => setForm({ ...form, kingdom: e.target.value })}
          />
        </label>

        <label>
          Backstory
          <textarea
            rows={5}
            value={form.backstory}
            onChange={e => setForm({ ...form, backstory: e.target.value })}
          />
        </label>

        <label>
          Powers (comma separated)
          <input
            value={form.powers}
            onChange={e => setForm({ ...form, powers: e.target.value })}
          />
        </label>

        <label>
          Traits (comma separated)
          <input
            value={form.traits}
            onChange={e => setForm({ ...form, traits: e.target.value })}
          />
        </label>

        <div className="row gap" style={{ marginTop: 8 }}>
          <Link to="/navatar" className="pill">
            Back to My Navatar
          </Link>
          <button className="pill pill--active">Save</button>
        </div>
      </form>
    </main>
  );
}

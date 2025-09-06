import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { loadPrimaryNavatarId, getCard, upsertCard, splitList } from "../../lib/card";
import { supabase } from "../../lib/supabase-client";
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
  const navigate = useNavigate();
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
      try {
        const card = await getCard(id);
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
      } catch (err) {
        console.warn(err);
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Not signed in");
      return;
    }
    setSaving(true);
    try {
      await upsertCard(user.id, {
        navatar_id: navatarId,
        name: form.name || null,
        species: form.species || null,
        kingdom: form.kingdom || null,
        backstory: form.backstory || null,
        powers: splitList(form.powers),
        traits: splitList(form.traits),
      });
      navigate("/navatar/mint");
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
      <h1 className="center">Character Card</h1>
      <NavatarTabs />
      <form onSubmit={onSave} style={{ maxWidth: 720, margin: "16px auto", display: "grid", gap: 12 }}>
        <label>
          Name
          <input value={form.name} onChange={onChange("name")} />
        </label>

        <label>
          Species / Type
          <input value={form.species} onChange={onChange("species")} />
        </label>

        <label>
          Kingdom
          <input value={form.kingdom} onChange={onChange("kingdom")} />
        </label>

        <label>
          Backstory
          <textarea rows={6} value={form.backstory} onChange={onChange("backstory")} />
        </label>

        <label>
          Powers (comma separated)
          <input value={form.powers} onChange={onChange("powers")} />
        </label>

        <label>
          Traits (comma separated)
          <input value={form.traits} onChange={onChange("traits")} />
        </label>

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Link to="/navatar" className="pill">Back to My Navatar</Link>
          <button className="pill pill--active" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import {
  getActiveNavatarId,
  getCharacterCard,
  upsertCharacterCard,
} from "../../lib/navatar";
import { supabase } from "../../lib/supabase-client";
import "../../styles/navatar.css";

export default function NavatarCardPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [kingdom, setKingdom] = useState("");
  const [backstory, setBackstory] = useState("");
  const [powers, setPowers] = useState("");
  const [traits, setTraits] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const id = await getActiveNavatarId(supabase);
        if (!id) return;
        const card = await getCharacterCard(supabase, id);
        if (card && alive) {
          setName(card.name ?? "");
          setSpecies(card.base_type ?? "");
          setKingdom(card.kingdom ?? "");
          setBackstory(card.backstory ?? "");
          setPowers((card.powers ?? []).join(", "));
          setTraits((card.traits ?? []).join(", "));
        }
      } catch (e: any) {
        setErr(e.message ?? "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const canSave = useMemo(
    () => [name, species, kingdom, backstory, powers, traits].some(v => v.trim().length > 0),
    [name, species, kingdom, backstory, powers, traits]
  );

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setErr(null);
    try {
      const id = await getActiveNavatarId(supabase);
      if (!id) {
        alert("Pick or upload a Navatar first");
        return;
      }

      await upsertCharacterCard(supabase, {
        avatar_id: id,
        name,
        base_type: species,
        kingdom,
        backstory,
        powers: powers ? powers.split(",").map(s => s.trim()).filter(Boolean) : [],
        traits: traits ? traits.split(",").map(s => s.trim()).filter(Boolean) : [],
      });

      nav("/navatar");
    } catch (e: any) {
      console.error(e);
      setErr(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="container page-pad">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Card" }]} />
        <h1 className="center page-title">Character Card</h1>
        <NavatarTabs sub />
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="container page-pad">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Card" }]} />
      <h1 className="center page-title">Character Card</h1>
      <NavatarTabs sub />
      <form className="form-card" onSubmit={onSave} style={{ margin: "16px auto" }}>
        {err && <p className="Error">{err}</p>}

        <label>
          Name
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>

        <label>
          Species / Type
          <input value={species} onChange={e => setSpecies(e.target.value)} />
        </label>

        <label>
          Kingdom
          <input value={kingdom} onChange={e => setKingdom(e.target.value)} />
        </label>

        <label>
          Backstory
          <textarea rows={5} value={backstory} onChange={e => setBackstory(e.target.value)} />
        </label>

        <label>
          Powers (comma separated)
          <input value={powers} onChange={e => setPowers(e.target.value)} />
        </label>

        <label>
          Traits (comma separated)
          <input value={traits} onChange={e => setTraits(e.target.value)} />
        </label>

        <div className="row gap" style={{ marginTop: 8 }}>
          <Link to="/navatar" className="pill">
            Back to My Navatar
          </Link>
          <button className="pill pill--active" disabled={!canSave || saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}


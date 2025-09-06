import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { fetchMyCharacterCard, getActiveNavatarId } from "../../lib/navatar";
import { supabase } from "../../lib/supabase-client";
import "../../styles/navatar.css";

export default function NavatarCardPage() {
  const navigate = useNavigate();
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
        const card = await fetchMyCharacterCard();
        if (card && alive) {
          setName(card.name ?? "");
          setSpecies(card.species ?? "");
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in");

      const navatarId =
        localStorage.getItem("active_navatar_id") ||
        (await getActiveNavatarId(supabase, user.id));

      if (!navatarId) {
        alert("Please create or select a Navatar first.");
        return;
      }

      const payload = {
        user_id: user.id,
        navatar_id: navatarId,
        name,
        species,
        kingdom,
        backstory,
        powers: powers ? powers.split(",").map((s) => s.trim()) : null,
        traits: traits ? traits.split(",").map((s) => s.trim()) : null,
      } as {
        user_id: string;
        navatar_id: string;
        name?: string | null;
        species?: string | null;
        kingdom?: string | null;
        backstory?: string | null;
        powers?: string[] | null;
        traits?: string[] | null;
      };

      const { error } = await supabase
        .from("character_cards")
        .upsert(payload, { onConflict: "navatar_id" });

      if (error) {
        console.error(error);
        alert("Could not save your card. Please try again.");
        return;
      }

      navigate("/navatar/mint");
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


import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { getMyAvatar, getMyCharacterCard, saveCharacterCard } from "../../lib/navatar";
import { useAuthUser } from "../../lib/useAuthUser";
import "../../styles/navatar.css";

export default function NavatarCardPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { user } = useAuthUser();

  const [avatar, setAvatar] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [kingdom, setKingdom] = useState("");
  const [backstory, setBackstory] = useState("");
  const [powers, setPowers] = useState("");
  const [traits, setTraits] = useState("");

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      try {
        const a = await getMyAvatar();
        if (alive) setAvatar(a || null);
        const c = await getMyCharacterCard();
        if (c && alive) {
          setName(c.name ?? "");
          setSpecies(c.species ?? "");
          setKingdom(c.kingdom ?? "");
          setBackstory(c.backstory ?? "");
          setPowers((c.powers ?? []).join(", "));
          setTraits((c.traits ?? []).join(", "));
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
  }, [user?.id]);

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
      if (!user || !avatar?.id) {
        alert("Pick a Navatar first.");
        return;
      }

      const powersArr = (powers || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const traitsArr = (traits || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      await saveCharacterCard({
        name,
        species,
        kingdom,
        backstory,
        powers: powersArr,
        traits: traitsArr,
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
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="container page-pad">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Card" }]} />
      <h1 className="center page-title">Character Card</h1>
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


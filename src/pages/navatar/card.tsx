import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../../components/Toast";
import { getMyAvatar, getMyCharacterCard } from "../../lib/navatar";
import { saveAvatar } from "../../lib/supabaseHelpers";
import "../../styles/navatar.css";

export default function NavatarCardPage() {
  const nav = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [avatar, setAvatar] = useState<any | null>(null);
  const [navatarId, setNavatarId] = useState<string | null>(null);

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
        const a = await getMyAvatar();
        const c = await getMyCharacterCard();
        if (!alive) return;
        setAvatar(a || null);
        setNavatarId(a?.id ?? null);
        setName(a?.name ?? "");
        setSpecies(a?.species ?? "");
        setKingdom(a?.kingdom ?? "");
        setBackstory(a?.backstory ?? "");
        setPowers((c?.powers ?? []).join(", "));
        setTraits((c?.traits ?? []).join(", "));
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const canSave = useMemo(
    () => [name, species, kingdom, backstory, powers, traits].some((v) => v.trim().length > 0),
    [name, species, kingdom, backstory, powers, traits]
  );

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!canSave) {
      toast({ text: "Add at least one field.", kind: "warn" });
      return;
    }
    try {
      setSaving(true);
      const powersArr = (powers || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const traitsArr = (traits || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const saved = await saveAvatar({
        id: navatarId ?? undefined,
        name,
        species,
        kingdom,
        backstory,
        powers: powersArr,
        traits: traitsArr,
      });

      if (saved?.id) setNavatarId(saved.id as string);
      toast({ text: "Card saved ✓", kind: "ok" });
      nav("/navatar");
    } catch (e: any) {
      console.error(e);
      setErr(e?.message ?? "Save failed");
      toast({ text: e?.message ?? "Save failed", kind: "err" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="page-pad mx-auto max-w-4xl p-4">
        <h1 className="pageTitle mt-6 mb-12">Character Card</h1>
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="page-pad mx-auto max-w-4xl p-4">
      <h1 className="pageTitle mt-6 mb-12">Character Card</h1>

      <form className="form-card" onSubmit={onSave} style={{ margin: "16px auto" }}>
        {err && <p className="Error">{err}</p>}

        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Species / Type
          <input value={species} onChange={(e) => setSpecies(e.target.value)} />
        </label>
        <label>
          Kingdom
          <input value={kingdom} onChange={(e) => setKingdom(e.target.value)} />
        </label>
        <label>
          Backstory
          <textarea
            rows={5}
            className="backstory-input"
            value={backstory}
            onChange={(e) => setBackstory(e.target.value)}
          />
        </label>
        <label>
          Powers (comma separated)
          <input value={powers} onChange={(e) => setPowers(e.target.value)} />
        </label>
        <label>
          Traits (comma separated)
          <input value={traits} onChange={(e) => setTraits(e.target.value)} />
        </label>

        <div className="row gap" style={{ marginTop: 8 }}>
          <Link to="/navatar" className="pill">
            Back to My Navatar
          </Link>
          <button
            className="pill pill--active"
            type="submit"
            aria-disabled={!canSave || saving}
            disabled={!canSave || saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}

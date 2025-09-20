import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { getMyAvatar, getMyCharacterCard } from "../../lib/navatar";
import { useAuthUser } from "../../lib/useAuthUser";
import { useToast } from "../../components/Toast";
import { callAI } from "@/lib/ai";
import { naturEvent } from "@/lib/events";
import { readNavatarDraft, saveNavatarDraft } from "@/lib/localdb";
import { saveNavatar } from "@/lib/supabaseHelpers";
import "../../styles/navatar.css";

type NavatarAiResult = {
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
};

export default function NavatarCardPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { user } = useAuthUser();
  const toast = useToast();

  const aiEnabled = import.meta.env.PROD || import.meta.env.VITE_ENABLE_AI === "true";
  const initialDraft = useMemo(() => readNavatarDraft(), []);
  const [avatar, setAvatar] = useState<any | null>(null);
  const [description, setDescription] = useState(initialDraft.description);
  const [name, setName] = useState(initialDraft.name);
  const [species, setSpecies] = useState(initialDraft.species);
  const [kingdom, setKingdom] = useState(initialDraft.kingdom);
  const [backstory, setBackstory] = useState(initialDraft.backstory);
  const [powers, setPowers] = useState(initialDraft.powers);
  const [traits, setTraits] = useState(initialDraft.traits);
  const [aiBusy, setAiBusy] = useState<"card" | "backstory" | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [rewardGranted, setRewardGranted] = useState(false);
  const [navatarId, setNavatarId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      try {
        const a = await getMyAvatar();
        if (alive) setAvatar(a || null);
        const c = await getMyCharacterCard();
        if (c && alive) {
          setNavatarId(c.id);
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

  useEffect(() => {
    saveNavatarDraft({ description, name, species, kingdom, backstory, powers, traits });
  }, [description, name, species, kingdom, backstory, powers, traits]);

  const ensureCooldown = () => {
    const now = Date.now();
    if (now < cooldownUntil) {
      toast({ text: "Give Turian a moment to finish the last request.", kind: "warn" });
      return false;
    }
    setCooldownUntil(now + 3000);
    return true;
  };

  async function generateWithTurian() {
    if (!aiEnabled || aiBusy) return;
    const idea = description.trim();
    if (!idea) {
      toast({ text: "Describe your character idea first.", kind: "warn" });
      return;
    }
    if (!ensureCooldown()) return;

    setAiBusy("card");
    try {
      const data = await callAI<NavatarAiResult>("card", { prompt: idea });
      setName(String(data.name ?? ""));
      setSpecies(String(data.species ?? ""));
      setKingdom(String(data.kingdom ?? ""));
      setBackstory(String(data.backstory ?? ""));
      toast({ text: "Turian drafted your character!" });

      if (!rewardGranted) {
        const noteBase = String(data.name ?? "Navatar card").slice(0, 60) || "Navatar card";
        naturEvent("grant_natur", { amount: 5, note: `Navatar card: ${noteBase}` });
        naturEvent("passport_stamp", { world: "Creative", note: noteBase });
        setRewardGranted(true);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Turian is offline right now.";
      toast({ text: message, kind: "err" });
    } finally {
      setAiBusy(null);
    }
  }

  async function suggestBackstory() {
    if (!aiEnabled || aiBusy) return;
    if (!name && !species && !kingdom) {
      toast({ text: "Add a name, species, or kingdom first.", kind: "warn" });
      return;
    }
    if (!ensureCooldown()) return;

    setAiBusy("backstory");
    try {
      const seed = { name, species, kingdom };
      const data = await callAI<{ backstory?: string }>("backstory", {
        prompt: JSON.stringify(seed),
      });
      const next = String(data.backstory ?? "");
      if (next) {
        setBackstory(next);
        toast({ text: "Backstory updated!" });
      } else {
        toast({ text: "Turian couldn't find a backstory just now.", kind: "warn" });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Turian is offline right now.";
      toast({ text: message, kind: "err" });
    } finally {
      setAiBusy(null);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!user) {
      toast({ text: "Please sign in to save.", kind: "err" });
      return;
    }
    if (!avatar?.id) {
      toast({ text: "Pick a Navatar first.", kind: "err" });
      return;
    }

    setSaving(true);
    setErr(null);
    try {

      const powersArr = (powers || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const traitsArr = (traits || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const saved = await saveNavatar({
        id: navatarId ?? undefined,
        name,
        species,
        kingdom,
        backstory,
        powers: powersArr,
        traits: traitsArr,
      });

      if (saved?.id) {
        setNavatarId(saved.id as string);
      }

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
      <main className="page-pad mx-auto max-w-4xl p-4">
        <div className="bcRow">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Card" }]} />
        </div>
        <h1 className="pageTitle mt-6 mb-12">Character Card</h1>
        <BackToMyNavatar />
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="page-pad mx-auto max-w-4xl p-4">
      <div className="bcRow">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Card" }]} />
      </div>
      <h1 className="pageTitle mt-6 mb-12">Character Card</h1>
      <BackToMyNavatar />
      <NavatarTabs context="subpage" />
      <form className="form-card" onSubmit={onSave} style={{ margin: "16px auto" }}>
        {err && <p className="Error">{err}</p>}

        {aiEnabled && (
          <section className="ai-card" aria-label="AI assist">
            <label>
              Character description
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your Navatar in a few sentences"
              />
            </label>
            <div className="ai-actions">
              <button
                type="button"
                className="ai-btn"
                onClick={generateWithTurian}
                disabled={aiBusy === "card" || description.trim().length === 0}
              >
                {aiBusy === "card" ? (
                  <>
                    <span className="spinner spinner-inline" aria-hidden="true" /> Generating…
                  </>
                ) : (
                  "Generate with Turian"
                )}
              </button>
              <button
                type="button"
                className="ai-btn ai-btn--ghost"
                onClick={suggestBackstory}
                disabled={aiBusy === "backstory" || (!name && !species && !kingdom)}
              >
                {aiBusy === "backstory" ? (
                  <>
                    <span className="spinner spinner-inline" aria-hidden="true" /> Suggesting…
                  </>
                ) : (
                  "Suggest Backstory"
                )}
              </button>
            </div>
            <p className="ai-note">We only send your description—never personal info.</p>
          </section>
        )}

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
          <textarea
            rows={5}
            className="backstory-input"
            value={backstory}
            onChange={e => setBackstory(e.target.value)}
          />
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
          <button className="pill pill--active" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}


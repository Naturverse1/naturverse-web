import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { getMyAvatar, getMyCharacterCard, saveCharacterCard } from "../../lib/navatar";
import { useAuthUser } from "../../lib/useAuthUser";
import { useToast } from "../../components/Toast";
import { callAI } from "@/lib/ai";
import { naturEvent } from "@/lib/events";
import { readNavatarDraft, saveNavatarDraft } from "@/lib/localdb";
import "../../styles/navatar.css";

type NavatarAiResult = {
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  powers?: string[];
  traits?: string[];
};

type CardState = {
  name: string;
  species: string;
  kingdom: string;
  backstory: string;
  powers: string[];
  traits: string[];
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
  const parseList = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  const sanitizeList = (value: (string | null)[] | null | undefined) =>
    Array.isArray(value)
      ? value.map((item) => String(item ?? "").trim()).filter(Boolean)
      : [];
  const normalizeCard = (data: NavatarAiResult): CardState => {
    const powers = sanitizeList(data.powers);
    const traits = sanitizeList(data.traits);
    return {
      name: String(data.name ?? "").trim(),
      species: String(data.species ?? "").trim(),
      kingdom: String(data.kingdom ?? "").trim(),
      backstory: String(data.backstory ?? "").trim(),
      powers: powers.length ? powers : ["Brave"],
      traits: traits.length ? traits : ["Kind"],
    };
  };
  const [card, setCard] = useState<CardState>({
    name: initialDraft.name,
    species: initialDraft.species,
    kingdom: initialDraft.kingdom,
    backstory: initialDraft.backstory,
    powers: parseList(initialDraft.powers),
    traits: parseList(initialDraft.traits),
  });
  const [aiBusy, setAiBusy] = useState<"card" | "backstory" | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [rewardGranted, setRewardGranted] = useState(false);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      try {
        const a = await getMyAvatar();
        if (alive) setAvatar(a || null);
        const c = await getMyCharacterCard();
        if (c && alive) {
          setCard({
            name: c.name ?? "",
            species: c.species ?? "",
            kingdom: c.kingdom ?? "",
            backstory: c.backstory ?? "",
            powers: sanitizeList(c.powers),
            traits: sanitizeList(c.traits),
          });
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
    saveNavatarDraft({
      description,
      name: card.name,
      species: card.species,
      kingdom: card.kingdom,
      backstory: card.backstory,
      powers: card.powers.join(", "),
      traits: card.traits.join(", "),
    });
  }, [description, card]);

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
      const data = await callAI<NavatarAiResult>("card", idea);
      const normalized = normalizeCard(data);
      setCard(normalized);
      toast({ text: "Turian drafted your character!" });

      if (!rewardGranted) {
        const noteBase = (normalized.name || "Navatar card").slice(0, 60) || "Navatar card";
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
    if (!card.name && !card.species && !card.kingdom) {
      toast({ text: "Add a name, species, or kingdom first.", kind: "warn" });
      return;
    }
    if (!ensureCooldown()) return;

    setAiBusy("backstory");
    try {
      const seed = { name: card.name, species: card.species, kingdom: card.kingdom };
      const data = await callAI<NavatarAiResult>("card", JSON.stringify(seed));
      const next = String(data.backstory ?? "").trim();
      if (next) {
        setCard((prev) => ({ ...prev, backstory: next }));
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

  const canSave = useMemo(
    () =>
      [card.name, card.species, card.kingdom, card.backstory].some((v) => v.trim().length > 0) ||
      card.powers.length > 0 ||
      card.traits.length > 0,
    [card]
  );

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    setErr(null);
    const safePowers = card.powers.length ? card.powers : ["Brave"];
    const safeTraits = card.traits.length ? card.traits : ["Kind"];
    try {
      if (user) {
        if (!avatar?.id) {
          toast({ text: "Pick a Navatar first.", kind: "err" });
          return;
        }
        await saveCharacterCard({
          name: card.name,
          species: card.species,
          kingdom: card.kingdom,
          backstory: card.backstory,
          powers: safePowers,
          traits: safeTraits,
        });
        toast({ text: "Saved to your account!" });
      } else if (typeof window !== "undefined") {
        const payload = {
          name: card.name,
          species: card.species,
          kingdom: card.kingdom,
          backstory: card.backstory,
          powers: safePowers,
          traits: safeTraits,
          user_id: null,
          updated_at: new Date().toISOString(),
        };
        try {
          window.localStorage.setItem("navatar.card", JSON.stringify(payload));
          toast({ text: "Saved locally" });
        } catch (storageError) {
          throw storageError instanceof Error
            ? storageError
            : new Error("Unable to save locally");
        }
      } else {
        throw new Error("Unable to save locally");
      }

      nav("/navatar");
    } catch (e: any) {
      console.error(e);
      const message = e?.message ?? "Save failed";
      setErr(message);
      toast({ text: message, kind: "err" });
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
      <form
        className="form-card"
        onSubmit={(event) => {
          event.preventDefault();
          handleSave();
        }}
        style={{ margin: "16px auto" }}
      >
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
                disabled={aiBusy === "backstory" || (!card.name && !card.species && !card.kingdom)}
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
          <input
            value={card.name}
            onChange={(e) => setCard((prev) => ({ ...prev, name: e.target.value }))}
          />
        </label>

        <label>
          Species / Type
          <input
            value={card.species}
            onChange={(e) => setCard((prev) => ({ ...prev, species: e.target.value }))}
          />
        </label>

        <label>
          Kingdom
          <input
            value={card.kingdom}
            onChange={(e) => setCard((prev) => ({ ...prev, kingdom: e.target.value }))}
          />
        </label>

        <label>
          Backstory
          <textarea
            rows={5}
            className="backstory-input"
            value={card.backstory}
            onChange={(e) => setCard((prev) => ({ ...prev, backstory: e.target.value }))}
          />
        </label>

        <label>
          Powers (comma separated)
          <input
            value={card.powers.join(", ")}
            onChange={(e) =>
              setCard((prev) => ({ ...prev, powers: parseList(e.target.value) }))
            }
          />
        </label>

        <label>
          Traits (comma separated)
          <input
            value={card.traits.join(", ")}
            onChange={(e) =>
              setCard((prev) => ({ ...prev, traits: parseList(e.target.value) }))
            }
          />
        </label>

        <div className="row gap" style={{ marginTop: 8 }}>
          <Link to="/navatar" className="pill">
            Back to My Navatar
          </Link>
          <button
            type="button"
            className="pill pill--active"
            onClick={handleSave}
            disabled={!canSave || saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}


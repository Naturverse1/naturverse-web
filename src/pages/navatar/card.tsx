import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { getMyAvatar, getMyCharacterCard, saveCharacterCard } from "../../lib/navatar";
import { useAuthUser } from "../../lib/useAuthUser";
import { useToast } from "../../components/Toast";
import { ai } from "../../lib/useAI";
import { cardPrompt, navatarPrompt, type CardCopy, type NavatarSheet } from "../../ai/schemas";
import "../../styles/navatar.css";

export default function NavatarCardPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { user } = useAuthUser();
  const toast = useToast();

  const [avatar, setAvatar] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [kingdom, setKingdom] = useState("");
  const [backstory, setBackstory] = useState("");
  const [powers, setPowers] = useState("");
  const [traits, setTraits] = useState("");
  const [navAiLoading, setNavAiLoading] = useState(false);
  const [navAiMessage, setNavAiMessage] = useState<string | null>(null);
  const [cardAiLoading, setCardAiLoading] = useState(false);
  const [cardAiMessage, setCardAiMessage] = useState<string | null>(null);

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
        toast({ text: "Pick a Navatar first.", kind: "err" });
        return;
      }

      const powersArr = csvToList(powers);
      const traitsArr = csvToList(traits);

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

  const powerList = csvToList(powers);
  const traitList = csvToList(traits);

  async function handleGenerateNavatar() {
    setNavAiMessage(null);
    setErr(null);
    setNavAiLoading(true);
    try {
      const likesSet = new Set<string>();
      [name, species, kingdom, ...powerList, ...traitList]
        .map(v => v?.trim())
        .filter(Boolean)
        .forEach(v => likesSet.add(v as string));

      const likes = Array.from(likesSet).slice(0, 6);
      if (likes.length === 0) {
        likes.push("nature", "kindness");
      }

      const vibeParts = [kingdom, traitList[0], "cheerful explorer"].filter(Boolean);
      const sheet = await ai<NavatarSheet>(
        "navatar",
        navatarPrompt({
          age: typeof avatar?.metadata?.age === "number" ? avatar.metadata.age : 9,
          vibe: vibeParts.join(" ") || "playful adventurer",
          likes,
        })
      );

      if (sheet.name) setName(sheet.name);
      if (sheet.species) setSpecies(sheet.species);
      if (sheet.kingdom) setKingdom(sheet.kingdom);
      if (sheet.tagline) setBackstory(sheet.tagline);
      if (Array.isArray(sheet.powers) && sheet.powers.length > 0) setPowers(sheet.powers.join(", "));
      if (Array.isArray(sheet.traits) && sheet.traits.length > 0) setTraits(sheet.traits.join(", "));

      setNavAiMessage("✨ Turian filled in your card! Edit anything you like.");
    } catch (error) {
      console.error(error);
      setNavAiMessage("Turian is thinking… try again later.");
    } finally {
      setNavAiLoading(false);
    }
  }

  async function handleSuggestBackstory() {
    setCardAiMessage(null);
    setErr(null);
    setCardAiLoading(true);
    try {
      const copy = await ai<CardCopy>(
        "card",
        cardPrompt({
          name: name || avatar?.name || "My Navatar",
          species: species || "mystical friend",
          kingdom: kingdom || (avatar?.metadata?.kingdom as string) || "Naturverse",
          powers: powerList.length > 0 ? powerList : ["friendship", "nature magic"],
        })
      );

      if (copy.headline && !name) setName(copy.headline);
      if (copy.backstory) setBackstory(copy.backstory);
      if (Array.isArray(copy.funFacts) && copy.funFacts.length > 0) {
        setTraits(copy.funFacts.join(", "));
      }

      setCardAiMessage("✨ Turian added a story! Feel free to tweak it.");
    } catch (error) {
      console.error(error);
      setCardAiMessage("Turian is thinking… try again later.");
    } finally {
      setCardAiLoading(false);
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

        <div className="row gap" style={{ justifyContent: "flex-end", marginBottom: 8 }}>
          <button
            type="button"
            className="pill"
            onClick={handleGenerateNavatar}
            disabled={navAiLoading}
          >
            {navAiLoading ? "Summoning…" : "Generate with Turian"}
          </button>
        </div>
        {navAiMessage && (
          <p className="meta" style={{ marginTop: -4, marginBottom: 12 }}>{navAiMessage}</p>
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
          <textarea rows={5} value={backstory} onChange={e => setBackstory(e.target.value)} />
        </label>
        <div className="row gap" style={{ justifyContent: "flex-end", marginTop: -4 }}>
          <button
            type="button"
            className="pill"
            onClick={handleSuggestBackstory}
            disabled={cardAiLoading}
          >
            {cardAiLoading ? "Summoning…" : "Suggest Backstory"}
          </button>
        </div>
        {cardAiMessage && (
          <p className="meta" style={{ marginTop: 4 }}>{cardAiMessage}</p>
        )}

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

function csvToList(value: string) {
  return (value || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}


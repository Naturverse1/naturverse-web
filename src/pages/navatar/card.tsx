import React, { useEffect, useState } from "react";
import NavatarTabs from "../../components/NavatarTabs";
import { loadActiveId, fetchMyCharacterCard, saveCharacterCard } from "../../lib/navatar";
import { supabase } from "../../lib/supabase";

export default function CharacterCardPage() {
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    species: "",
    kingdom: "",
    backstory: "",
    powers: "",
    traits: "",
  });
  const [busy, setBusy] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user && alive) setSignedIn(false);

      const id = loadActiveId();
      setAvatarId(id);

      const existing = await fetchMyCharacterCard();
      if (existing && alive) {
        setForm({
          name: existing.name || "",
          species: existing.species || "",
          kingdom: existing.kingdom || "",
          backstory: existing.backstory || "",
          powers: (existing.powers || []).join(", "),
          traits: (existing.traits || []).join(", "),
        });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!avatarId) {
      alert("Please pick or upload a Navatar first.");
      return;
    }
    setBusy(true);
    try {
      await saveCharacterCard({
        avatar_id: avatarId,
        name: form.name.trim() || null,
        species: form.species.trim() || null,
        kingdom: form.kingdom.trim() || null,
        backstory: form.backstory.trim() || null,
        powers: form.powers
          ? form.powers.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        traits: form.traits
          ? form.traits.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      });
      alert("Saved!");
    } catch (err: any) {
      alert(err.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  if (!signedIn) {
    return (
      <main className="container page-pad">
        <h1 className="center page-title">Character Card</h1>
        <NavatarTabs />
        <p>Please sign in</p>
      </main>
    );
  }

  return (
    <main className="container page-pad">
      <h1 className="center page-title">Character Card</h1>
      <NavatarTabs />

      <form className="form" style={{ maxWidth: 680 }} onSubmit={onSubmit}>
        <label className="label">Name</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />

        <label className="label">Species / Type</label>
        <input
          className="input"
          value={form.species}
          onChange={(e) => setForm((f) => ({ ...f, species: e.target.value }))}
        />

        <label className="label">Kingdom</label>
        <input
          className="input"
          value={form.kingdom}
          onChange={(e) => setForm((f) => ({ ...f, kingdom: e.target.value }))}
        />

        <label className="label">Backstory</label>
        <textarea
          className="textarea"
          rows={4}
          value={form.backstory}
          onChange={(e) => setForm((f) => ({ ...f, backstory: e.target.value }))}
        />

        <label className="label">Powers (comma separated)</label>
        <input
          className="input"
          value={form.powers}
          onChange={(e) => setForm((f) => ({ ...f, powers: e.target.value }))}
        />

        <label className="label">Traits (comma separated)</label>
        <input
          className="input"
          value={form.traits}
          onChange={(e) => setForm((f) => ({ ...f, traits: e.target.value }))}
        />

        <div style={{ marginTop: 16 }}>
          <button className="btn" disabled={busy}>
            {busy ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}

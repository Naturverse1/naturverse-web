import { useMemo, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { loadActiveNavatar } from "../../lib/navatar";
import "../../styles/navatar.css";
import { upsertCharacterCard } from "../../lib/supabase";

export default function NavatarCardPage() {
  const active = useMemo(() => loadActiveNavatar(), []);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!active) {
      alert("Please pick or upload a Navatar first.");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: (fd.get("name") as string) || "",
      species: (fd.get("species") as string) || "",
      kingdom: (fd.get("kingdom") as string) || "",
      backstory: (fd.get("backstory") as string) || "",
      powers: ((fd.get("powers") as string) || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      traits: ((fd.get("traits") as string) || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      // associate with whatever your server expects; here we attach the navatar src as identifier
      navatar_src: active.src,
    };
    setSaving(true);
    try {
      await upsertCharacterCard(payload);
      alert("Saved!");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container page-pad">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/navatar", label: "Navatar" },
          { href: "/navatar/card", label: "Card" },
        ]}
      />
      <h1 className="center page-title">Character Card</h1>
      <NavatarTabs />

      <form className="nv-panel" onSubmit={onSubmit} style={{ marginTop: 12 }}>
        {!active && <p><strong>Please sign in</strong> or pick/upload a Navatar first.</p>}
        <div className="form-row">
          <label>Name</label>
          <input name="name" type="text" />
        </div>
        <div className="form-row">
          <label>Species / Type</label>
          <input name="species" type="text" />
        </div>
        <div className="form-row">
          <label>Kingdom</label>
          <input name="kingdom" type="text" />
        </div>
        <div className="form-row">
          <label>Backstory</label>
          <textarea name="backstory" rows={4} />
        </div>
        <div className="form-row">
          <label>Powers (comma separated)</label>
          <input name="powers" type="text" />
        </div>
        <div className="form-row">
          <label>Traits (comma separated)</label>
          <input name="traits" type="text" />
        </div>
        <button className="btn" disabled={saving} type="submit">
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </main>
  );
}

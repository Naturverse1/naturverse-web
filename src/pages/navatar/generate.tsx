import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BlueBreadcrumbs } from "../../components/BlueBreadcrumbs";
import { PageShell } from "../../components/PageShell";
import { NavatarTabs } from "../../components/NavatarTabs";
import { NavatarCard } from "../../components/NavatarCard";
import { saveActive } from "../../lib/localStorage";
import "../../styles/navatar.css";

export default function GenerateNavatarPage() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [draftUrl, setDraftUrl] = useState<string | undefined>();
  const nav = useNavigate();

  useEffect(() => {
    if (!file) {
      setDraftUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setDraftUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    let dataUrl = "";
    if (file) {
      dataUrl = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result));
        r.readAsDataURL(file);
      });
    }
    saveActive({ id: Date.now(), name, imageDataUrl: dataUrl, prompt, createdAt: Date.now() });
    alert("Saved ✓");
    nav("/navatar");
  }

  return (
    <PageShell>
      <BlueBreadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Navatar", to: "/navatar" }, { label: "Describe & Generate", to: "/navatar/generate" }]}
      />
      <h1 className="nv-heading">Describe &amp; Generate</h1>
      <NavatarTabs active="generate" />
      <form
        onSubmit={onSave}
        style={{ maxWidth: 520, margin: "16px auto", display: "grid", justifyItems: "center", gap: 12 }}
      >
        <NavatarCard src={draftUrl} title={name || "My Navatar"} />
        <textarea
          rows={4}
          placeholder="Describe your Navatar (e.g., friendly water-buffalo spirit)…"
          style={{ width: "100%" }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <input
          style={{ display: "block", width: "100%" }}
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button className="nv-button" type="submit" style={{ marginTop: 8 }}>
          Save
        </button>
      </form>
      <p className="nv-muted" style={{ textAlign: "center" }}>
        AI art & edit coming soon.
      </p>
    </PageShell>
  );
}


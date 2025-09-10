import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/navatar/Breadcrumbs";
import NavTabs from "../../components/navatar/NavTabs";
import NavatarCard from "../../components/NavatarCard";
import { saveNavatar } from "../../lib/navatar";
import { setActiveNavatarId } from "../../lib/localNavatar";
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
    if (!file) return;
    try {
      const row = await saveNavatar({ name, base_type: "Animal", backstory: prompt, file });
      setActiveNavatarId(row.id);
      alert("Saved ✓");
      nav("/navatar");
    } catch {
      alert("Save failed");
    }
  }

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <Breadcrumbs trail={[{ to: '/navatar', label: 'Navatar' }, { label: 'Describe & Generate' }]} />
      <h1 className="text-4xl font-bold text-blue-700 mb-2">Describe &amp; Generate</h1>
      <NavTabs />
      <form
        onSubmit={onSave}
        style={{ maxWidth: 520, margin: '16px auto', display: 'grid', justifyItems: 'center', gap: 12 }}
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
        <button className="pill pill--active" type="submit" style={{ marginTop: 8 }}>
          Save
        </button>
      </form>
      <p className="center" style={{ opacity: 0.8 }}>
        AI art & edit coming soon.
      </p>
    </div>
  );
}


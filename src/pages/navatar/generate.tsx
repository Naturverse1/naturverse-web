import { useState } from "react";
import { useSession } from "@/lib/session"; // or however you read user id
import "@/styles/navatar.css";

async function fileToDataUrl(file: File | null): Promise<string | null> {
  if (!file) return null;
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.readAsDataURL(file);
  });
}

export default function NavatarGeneratePage() {
  const { user } = useSession(); // assumes user?.id
  const [prompt, setPrompt] = useState("");
  const [name, setName] = useState("");
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [maskFile, setMaskFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setLoading(true);

    try {
      const body = {
        prompt: prompt.trim(),
        name: name.trim() || undefined,
        userId: user?.id || undefined,
        sourceDataUrl: await fileToDataUrl(sourceFile),
        maskDataUrl: await fileToDataUrl(maskFile),
      };

      const res = await fetch("/.netlify/functions/generate-navatar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }
      setOk("Created! Opened/saved to your Navatars.");
      // optionally navigate to /navatar or refresh
      // location.href = "/navatar?refresh=1";
    } catch (err: any) {
      setError(err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="nv-container">
      <nav className="nv-breadcrumbs">
        <a href="/">Home</a> <span>/</span>
        <a href="/navatar">Navatar</a> <span>/</span>
        <span className="current">Describe &amp; Generate</span>
      </nav>

      <h1 className="nv-title">Describe &amp; Generate</h1>

      <form className="nv-card" onSubmit={onSubmit}>
        <label className="nv-label">Describe your Navatar</label>
        <textarea
          className="nv-input nv-textarea"
          placeholder={`e.g., "friendly water-buffalo spirit, gold robe, jungle temple, sunny morning, storybook style"`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required={!sourceFile}
        />

        <div className="nv-file-block">
          <label className="nv-label">Source Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSourceFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="nv-file-block">
          <label className="nv-label">
            Mask Image (optional, transparent areas → replaced)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMaskFile(e.target.files?.[0] || null)}
          />
        </div>

        <input
          className="nv-input"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {error && <div className="nv-error">{error}</div>}
        {ok && <div className="nv-success">{ok}</div>}

        <button disabled={loading} className="nv-btn nv-btn-primary">
          {loading ? "Creating..." : "Save"}
        </button>
      </form>

      <p className="nv-tip">
        Tips: Keep faces centered, ask for full-body vs portrait, and mention
        “storybook / illustration / character sheet” for that Navatar vibe.
      </p>
    </div>
  );
}


import { useMemo, useState } from "react";

type Provider = "openai" | "stability" | "huggingface" | "deepai" | "multavatar";

const PROVIDERS: Provider[] = ["openai", "stability", "huggingface", "deepai", "multavatar"];
const labels: Record<Provider, string> = {
  openai: "OpenAI",
  stability: "Stability",
  huggingface: "Hugging Face",
  deepai: "DeepAI",
  multavatar: "Basic (Avatar)",
};
const endpoints: Record<Provider, string> = {
  openai: "/.netlify/functions/openai-generate",
  stability: "/.netlify/functions/stability-generate",
  huggingface: "/.netlify/functions/hf-generate",
  deepai: "/.netlify/functions/deepai-generate",
  multavatar: "/.netlify/functions/multavatar-generate",
};

export default function GenerateNavatar() {
  const [provider, setProvider] = useState<Provider>("openai");
  const [prompt, setPrompt] = useState("");
  const [seed, setSeed] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const needsPrompt = provider !== "multavatar";
  const needsSeed = provider === "multavatar";

  const canSubmit = useMemo(() => {
    if (loading) return false;
    if (needsPrompt && !prompt.trim()) return false;
    if (needsSeed && !seed.trim()) return false;
    return true;
  }, [loading, needsPrompt, needsSeed, prompt, seed]);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setImage(null);
    try {
      const body: any = { size };
      if (needsPrompt) body.prompt = prompt.trim();
      if (needsSeed) body.seed = seed.trim();

      const res = await fetch(endpoints[provider], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(async () => {
        const raw = await res.text().catch(() => "");
        throw new Error(raw || `HTTP ${res.status}`);
      });

      if (!data?.ok || !data?.image) {
        throw new Error(data?.error || "generation_failed");
      }
      setImage(data.image as string);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pageRoot">
      <div className="pagePad max-w-3xl mx-auto">
        <h1 className="pageTitle">Describe &amp; Generate</h1>

        {/* Provider pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PROVIDERS.map((p) => (
            <button
              key={p}
              onClick={() => setProvider(p)}
              className={`pill ${provider === p ? "pill-active" : "pill-muted"}`}
              aria-pressed={provider === p}
            >
              {labels[p]}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid gap-3 mb-4">
          {needsSeed && (
            <div>
              <label className="label">Seed / Name</label>
              <input
                className="input"
                value={seed}
                placeholder="e.g., turtle-hero"
                onChange={(e) => setSeed(e.target.value)}
              />
            </div>
          )}

          {needsPrompt && (
            <div>
              <label className="label">Prompt</label>
              <textarea
                className="textarea"
                rows={4}
                value={prompt}
                placeholder="Describe your Navatar..."
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="label">Size</label>
            <input className="input" value={size} onChange={(e) => setSize(e.target.value)} />
            <p className="hint text-sm mt-1">Format: WIDTHxHEIGHT (e.g., 1024x1024)</p>
          </div>
        </div>

        <button className="btn btn-primary" disabled={!canSubmit} onClick={onGenerate}>
          {loading ? "Generating…" : "Generate"}
        </button>

        <div className="card mt-4 min-h-[320px] flex items-center justify-center">
          {image ? <img src={image} alt="My Navatar" className="max-h-[512px] w-auto" /> : <p>My Navatar</p>}
        </div>

        {error && (
          <p className="mt-3 text-red-600 break-words">
            Generation failed: {error}
          </p>
        )}
      </div>
    </main>
  );
}

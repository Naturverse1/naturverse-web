import React, { useState } from "react";
import { jsonPost } from "../../lib/jsonPost";

type Provider = "openai" | "stability" | "huggingface" | "deepai" | "multavatar";

const PROVIDERS: { key: Provider; label: string; fn: string; needsPrompt?: boolean }[] = [
  { key: "openai", label: "OpenAI",        fn: "/.netlify/functions/openai-generate", needsPrompt: true },
  { key: "stability", label: "Stability",  fn: "/.netlify/functions/stability-generate", needsPrompt: true },
  { key: "huggingface", label: "Hugging Face", fn: "/.netlify/functions/hf-generate", needsPrompt: true },
  { key: "deepai", label: "DeepAI",        fn: "/.netlify/functions/deepai-generate", needsPrompt: true },
  { key: "multavatar", label: "Basic (Avatar)", fn: "/.netlify/functions/multavatar-generate", needsPrompt: false },
];

export default function Generate() {
  const [provider, setProvider] = useState<Provider>("openai");
  const [prompt, setPrompt] = useState("");
  const [seed, setSeed] = useState("");
  const [size, setSize] = useState<512 | 1024 | 2048>(1024);
  const [img, setImg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onGenerate() {
    setErr(null); setImg(null); setBusy(true);
    try {
      const endpoint = PROVIDERS.find(p => p.key === provider)!.fn;
      const payload = provider === "multavatar"
        ? { seed: seed || "navatar", size }
        : { prompt, size };

      const res: any = await jsonPost(endpoint, payload);
      if (!res.ok) throw new Error(`${res.error?.code || "error"}: ${res.error?.message || "Unknown"}`);
      setImg(`data:${res.image?.mime || "image/png"};base64,${res.image?.base64}`);
    } catch (e: any) {
      setErr(`Generation failed: ${e.message || e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="nv-wrap">
      <h1>Describe &amp; Generate</h1>

      <div className="nv-pills">
        {PROVIDERS.map(p => (
          <button key={p.key}
            className={`pill ${provider === p.key ? "active" : ""}`}
            onClick={() => setProvider(p.key)}>
            {p.label}
          </button>
        ))}
      </div>

      {provider === "multavatar" ? (
        <>
          <label>Seed / Name</label>
          <input value={seed} onChange={e => setSeed(e.target.value)} placeholder="e.g., turtle-hero" />
        </>
      ) : (
        <>
          <label>Prompt</label>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your Navatar..." />
        </>
      )}

      <label>Size</label>
      <div className="nv-sizes">
        {[512, 1024, 2048].map(s => (
          <button key={s} className={`size ${size === s ? "active" : ""}`} onClick={() => setSize(s as any)}>{s}</button>
        ))}
      </div>

      <button className="btn-primary" disabled={busy} onClick={onGenerate}>
        {busy ? "Generating..." : "Generate"}
      </button>

      <div className="nv-card">
        {img ? <img src={img} alt="navatar" /> : <div className="placeholder">My Navatar</div>}
      </div>

      {err && <div className="nv-error">{err}</div>}
    </div>
  );
}

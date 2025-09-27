import { useState } from "react";

type Provider = "openai" | "stability" | "deepai" | "huggingface" | "multiavatar";

const PROVIDERS: { id: Provider; label: string; fn: string; bodyKey: "prompt" | "seed" }[] = [
  { id: "openai",      label: "OpenAI",        fn: "/.netlify/functions/openai-generate",      bodyKey: "prompt" },
  { id: "stability",   label: "Stability",     fn: "/.netlify/functions/stability-generate",   bodyKey: "prompt" },
  { id: "deepai",      label: "DeepAI",        fn: "/.netlify/functions/deepai-generate",      bodyKey: "prompt" },
  { id: "huggingface", label: "Hugging Face",  fn: "/.netlify/functions/hf-generate",          bodyKey: "prompt" },
  { id: "multiavatar", label: "Basic (Avatar)",fn: "/.netlify/functions/multavatar-generate",  bodyKey: "seed"   },
];

export default function NavatarGenerate() {
  const [provider, setProvider] = useState<Provider>("openai");
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState(1024);
  const [img, setImg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const active = PROVIDERS.find(p => p.id === provider)!;

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null); setImg(null);

    try {
      const body: any = { size };
      body[active.bodyKey] = prompt.trim();
      const res = await fetch(active.fn, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.ok || !json.dataUrl) throw new Error(json.error || "Generation failed");
      setImg(json.dataUrl as string);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page pad">
      <h2>Describe &amp; Generate</h2>

      <div className="pill-row">
        {PROVIDERS.map(p => (
          <button
            key={p.id}
            className={`pill ${p.id === provider ? "pill-active" : ""}`}
            onClick={() => setProvider(p.id)}
            type="button"
          >
            {p.label}
          </button>
        ))}
      </div>

      <form onSubmit={onGenerate} className="gen-form">
        <label>{active.bodyKey === "seed" ? "Seed / Name" : "Prompt"}</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={active.bodyKey === "seed" ? "e.g., username123" : "Describe your Navatar…"}
          rows={3}
        />
        <div className="row">
          <label>Size</label>
          <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
            {[512, 768, 1024].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn" disabled={busy || !prompt.trim()}>{busy ? "Generating…" : "Generate"}</button>
        </div>
      </form>

      <section className="preview">
        <div className="card">
          {img ? <img alt="Navatar" src={img} /> : <div className="placeholder">My Navatar</div>}
        </div>
        {err && <p className="error">Generation failed: {err}</p>}
      </section>

      <style>{`
        .pill-row{display:flex;gap:.5rem;flex-wrap:wrap;margin:0 0 .75rem}
        .pill{border:1px solid #cfd3d8;border-radius:999px;padding:.4rem .8rem;background:#fff}
        .pill-active{background:#2563eb;color:#fff;border-color:#2563eb}
        .gen-form{display:grid;gap:.5rem;max-width:560px}
        .row{display:flex;gap:.5rem;align-items:center}
        .btn{padding:.5rem 1rem;border-radius:.5rem;background:#2563eb;color:#fff}
        .preview{margin-top:1rem}
        .card{width:360px;max-width:100%;aspect-ratio:1/1;border:1px solid #e5e7eb;border-radius:.75rem;display:grid;place-items:center;overflow:hidden}
        .placeholder{color:#9aa1a9}
        img{display:block;width:100%;height:100%;object-fit:cover}
        .error{color:#b91c1c}
      `}</style>
    </main>
  );
}

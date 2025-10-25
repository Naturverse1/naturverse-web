import { useState } from "react";
import { generateImage, type Provider } from "../../lib/navatar/generateClient";

const pill =
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold transition " +
  "bg-blue-600 text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-400";

const tab =
  "inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold transition " +
  "bg-slate-100 text-slate-800 hover:bg-slate-200";

const providers: Provider[] = ["openai", "stability", "deepai", "huggingface"];

export default function NavatarGenerate() {
  const [provider, setProvider] = useState<Provider>("openai");
  const [prompt, setPrompt] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onGenerate() {
    setErr(null);
    setImg(null);

    if (!prompt.trim()) {
      setErr("Please enter a prompt.");
      return;
    }

    setBusy(true);
    try {
      const out = await generateImage(provider, {
        prompt,
        size: "512x512",
        width: 512,
        height: 512,
      });
      setImg(out);
    } catch (error: any) {
      const message = typeof error?.message === "string" ? error.message.trim() : "";
      setErr(message || `Generation failed with ${provider.toUpperCase()}. Try a different provider or size.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-bold mb-4">Create your NAVATAR</h1>

      <div className="flex gap-2 flex-wrap mb-4">
        {providers.map((p) => (
          <button
            key={p}
            className={p === provider ? pill : tab}
            onClick={() => setProvider(p)}
            type="button"
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Prompt</label>
        <textarea
          className="w-full rounded border border-slate-300 p-2"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your NAVATAR in Naturverse style…"
        />
      </div>

      <button
        className={pill}
        onClick={onGenerate}
        disabled={busy}
        type="button"
      >
        {busy ? "Generating…" : "Generate"}
      </button>

      {err && <p className="mt-3 text-red-600 text-sm">{err}</p>}

      {img && (
        <div className="mt-6">
          <img
            src={img}
            alt="Generated NAVATAR"
            className="w-full max-w-md rounded border border-slate-200"
          />
        </div>
      )}
    </div>
  );
}

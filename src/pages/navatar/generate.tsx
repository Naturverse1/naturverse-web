import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import NavatarCard from "../../components/NavatarCard";
import { useToast } from "../../components/Toast";
import { listProviders, getSelectedProvider } from "../../lib/image/providers";
import { setActiveNavatarId } from "../../lib/localNavatar";
import { uploadNavatar } from "../../lib/navatar";
import { generateImage, type Provider } from "../../lib/navatar/generateClient";
import "../../styles/navatar.css";

const sizeOptions = ["256x256", "512x512", "1024x1024"] as const;

const providerOptions = listProviders();

export default function NavatarGenerate() {
  const [provider, setProvider] = useState<Provider>(() => getSelectedProvider());
  const [prompt, setPrompt] = useState("");
  const [name, setName] = useState("");
  const [size, setSize] = useState<(typeof sizeOptions)[number]>("512x512");
  const [preview, setPreview] = useState<string | null>(null);
  const [generatedFile, setGeneratedFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();
  const nav = useNavigate();

  const providerLabel =
    providerOptions.find((opt) => opt.id === provider)?.label ?? provider.toUpperCase();
  const showSizeSelector = provider !== "huggingface";
  const hasMultipleProviders = providerOptions.length > 1;

  async function onGenerate() {
    if (busy) return;

    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("Please enter a prompt.");
      toast({ text: "Please enter a prompt.", kind: "warn" });
      return;
    }

    setBusy(true);
    setError(null);
    setPreview(null);
    setGeneratedFile(null);

    try {
      const image = await generateImage(provider, {
        prompt: trimmed,
        size,
        width: 512,
        height: 512,
      });

      const file = dataUrlToFile(image, `navatar-${Date.now()}.png`);
      setPreview(image);
      setGeneratedFile(file);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      setError(message);
      toast({ text: message, kind: "err" });
    } finally {
      setBusy(false);
    }
  }

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!generatedFile || saving) return;

    setSaving(true);
    setError(null);

    try {
      const row = await uploadNavatar(generatedFile, name || undefined);
      setActiveNavatarId(row.id);
      toast({ text: "Saved ✓", kind: "ok" });
      nav("/navatar");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      setError(message);
      toast({ text: message, kind: "err" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-pad mx-auto max-w-4xl p-4">
      <div className="bcRow">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/navatar", label: "Navatar" },
            { label: "Generate" },
          ]}
        />
      </div>

      <h1 className="pageTitle mt-6 mb-12">Create your Navatar</h1>
      <BackToMyNavatar />
      <NavatarTabs context="subpage" />

      <form
        onSubmit={onSave}
        className="mt-8 grid justify-items-center gap-6"
        style={{ maxWidth: 520, margin: "0 auto" }}
      >
        <NavatarCard src={preview} title={name || "My Navatar"} />

        <input
          style={{ display: "block", width: "100%" }}
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div style={{ width: "100%" }}>
          <label className="block text-sm font-medium mb-1" htmlFor="navatar-prompt">
            Prompt
          </label>
          <textarea
            id="navatar-prompt"
            className="w-full rounded border border-slate-300 p-2"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your NAVATAR in Naturverse style…"
          />
        </div>

        <div className="flex w-full flex-wrap items-center gap-2">
          {hasMultipleProviders ? (
            providerOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={opt.id === provider ? "pill pill--active" : "pill"}
                onClick={() => setProvider(opt.id)}
              >
                {opt.label}
              </button>
            ))
          ) : (
            <span className="pill pill--active" aria-live="polite">
              {providerLabel}
            </span>
          )}
        </div>

        {showSizeSelector ? (
          <div style={{ width: "100%" }}>
            <label className="block text-sm font-medium mb-1" htmlFor="navatar-size">
              Image size
            </label>
            <select
              id="navatar-size"
              className="w-full rounded border border-slate-300 p-2"
              value={size}
              onChange={(e) => setSize(e.target.value as (typeof sizeOptions)[number])}
            >
              {sizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="flex w-full flex-wrap gap-3">
          <button
            type="button"
            className="pill"
            onClick={onGenerate}
            disabled={busy}
          >
            {busy ? "Generating…" : "Generate"}
          </button>
          <button
            type="submit"
            className="pill pill--active"
            disabled={saving || !generatedFile}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>
    </main>
  );
}

function dataUrlToFile(dataUrl: string, fileName: string): File {
  if (!dataUrl.startsWith("data:")) {
    throw new Error("Generation did not return a data URL image");
  }

  const [header, base64] = dataUrl.split(",", 2);
  if (!base64) {
    throw new Error("Malformed data URL image");
  }

  const match = header.match(/data:(.*?);base64/);
  const mime = match?.[1] || "image/png";
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], fileName, { type: mime });
}

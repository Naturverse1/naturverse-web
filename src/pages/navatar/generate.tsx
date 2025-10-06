import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarCard from "../../components/NavatarCard";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { uploadNavatar } from "../../lib/navatar";
import { setActiveNavatarId } from "../../lib/localNavatar";
import { useToast } from "../../components/Toast";
import { getSelectedProvider, setSelectedProvider, type Provider } from "@/lib/image/providers";
import { logEvent } from "@/lib/activity";
import "../../styles/navatar.css";

const SIZE_OPTIONS = [512, 1024, 2048] as const;

const ENDPOINTS: Record<Provider, string> = {
  openai: "/.netlify/functions/openai-generate",
  huggingface: "/.netlify/functions/hf-generate",
  deepai: "/.netlify/functions/deepai-generate",
  basic: "/.netlify/functions/multavatar-generate",
};

type ApiError = Error & {
  code?: string;
  details?: string;
};

async function postJSON(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });

  const data = (await response.json().catch(() => ({}))) as
    | { ok: true; dataUrl: string }
    | { ok?: false; code?: string; error?: string };

  if (!response.ok || !data || data.ok !== true) {
    const err: ApiError = new Error(
      ("error" in data && typeof data.error === "string" && data.error) ||
        ("code" in data && typeof data.code === "string" && data.code) ||
        `Request failed (${response.status})`,
    );
    if (data && typeof data === "object") {
      if ("code" in data && typeof data.code === "string") err.code = data.code;
      if ("error" in data && typeof data.error === "string") err.details = data.error;
    }
    throw err;
  }

  return data as { ok: true; dataUrl: string };
}

function formatProviderName(provider: Provider) {
  switch (provider) {
    case "openai":
      return "OpenAI";
    case "huggingface":
      return "Hugging Face";
    case "deepai":
      return "DeepAI";
    case "basic":
      return "Multavatar";
    default:
      return provider;
  }
}

function describeError(code?: string, fallback?: string) {
  if (!code) return fallback || "Try again or pick another provider.";

  const map: Record<string, string> = {
    openai_missing_key: "OpenAI API key is missing. Add OPENAI_API_KEY in Netlify.",
    openai_missing_prompt: "Enter a prompt for OpenAI generation.",
    openai_no_image: "OpenAI did not return an image.",
    openai_invalid_body: "We sent an invalid request to OpenAI.",
    openai_invalid_response: "OpenAI returned an invalid response.",
    huggingface_missing_key: "Hugging Face API token is missing.",
    huggingface_missing_prompt: "Enter a prompt for Hugging Face generation.",
    huggingface_quota: "Hugging Face says the quota has been reached.",
    huggingface_unexpected: "Hugging Face returned an unexpected response.",
    huggingface_invalid_body: "We sent an invalid request to Hugging Face.",
    deepai_missing_key: "DeepAI API key is missing.",
    deepai_missing_prompt: "Enter a prompt for DeepAI generation.",
    deepai_quota: "DeepAI credits are exhausted.",
    deepai_no_output: "DeepAI did not provide an output image.",
    deepai_invalid_body: "We sent an invalid request to DeepAI.",
    deepai_invalid_response: "DeepAI returned an invalid response.",
    multavatar_missing_seed: "Enter a name or seed for the Multavatar generator.",
    multavatar_invalid_body: "We sent an invalid request to Multavatar.",
  };

  if (map[code]) return map[code];
  if (code.endsWith("_exception")) return fallback || "The request failed unexpectedly.";
  if (code.includes("quota")) return "This provider is out of credits right now.";
  if (code.includes("_429")) return "Too many requests. Wait a moment and try again.";
  if (code.startsWith("openai_")) return "OpenAI returned an error.";
  if (code.startsWith("huggingface_")) return "Hugging Face returned an error.";
  if (code.startsWith("deepai_")) return "DeepAI returned an error.";
  if (code.startsWith("multavatar_")) return "Multavatar returned an error.";
  return fallback || "Try again or pick another provider.";
}

const pill =
  "nv-pill inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition shadow-sm " +
  "bg-white/80 text-slate-500 ring-1 ring-slate-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400";
const pillActive = "bg-sky-600 text-white ring-sky-600 hover:bg-sky-600";
const input =
  "w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400";
const buttonBase =
  "w-full rounded-2xl px-5 py-4 text-center font-bold text-white shadow-md hover:opacity-95 active:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/60";
const generateButton = `${buttonBase} bg-sky-600`;
const saveButton = `${buttonBase} bg-emerald-600`;

export default function DescribeAndGeneratePage() {
  const toast = useToast();
  const nav = useNavigate();
  const [provider, setProvider] = useState<Provider>(getSelectedProvider());
  const [prompt, setPrompt] = useState("");
  const [seed, setSeed] = useState("");
  const [size, setSize] = useState<number>(1024);
  const [name, setName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [usedProvider, setUsedProvider] = useState<Provider | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setSelectedProvider(provider);
  }, [provider]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const sizeLabel = `${size}x${size}`;

  async function onGenerate() {
    const trimmedPrompt = prompt.trim();
    const trimmedSeed = seed.trim();

    if (provider === "basic" && !trimmedSeed) {
      const message = "Enter a name or seed before generating.";
      setErrorMessage(`Generation failed: ${message}`);
      toast({ text: message, kind: "warn" });
      return;
    }

    if (provider !== "basic" && !trimmedPrompt) {
      const message = "Enter a description first.";
      setErrorMessage(`Generation failed: ${message}`);
      toast({ text: message, kind: "warn" });
      return;
    }

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }

    setIsGenerating(true);
    setGeneratedFile(null);
    setPreviewUrl(null);
    setUsedProvider(null);
    setErrorMessage(null);

    try {
      const body =
        provider === "basic"
          ? { seed: trimmedSeed }
          : { prompt: trimmedPrompt, size: sizeLabel };
      const result = await postJSON(ENDPOINTS[provider], body);
      setUsedProvider(provider);

      try {
        const response = await fetch(result.dataUrl);
        if (!response.ok) {
          throw new Error(`download_${response.status}`);
        }
        const blob = await response.blob();
        const file = new File([blob], `navatar-${Date.now()}.png`, {
          type: blob.type || "image/png",
        });
        const localUrl = URL.createObjectURL(blob);
        setGeneratedFile(file);
        setObjectUrl(localUrl);
        setPreviewUrl(localUrl);
        setErrorMessage(null);
        void logEvent("avatar.created", {
          method: "generate",
          provider,
          size: provider === "basic" ? undefined : size,
        });
      } catch (downloadErr) {
        console.error(downloadErr);
        setPreviewUrl(result.dataUrl);
        setErrorMessage(
          "Generation succeeded, but we couldn't prepare the image for saving. Download the preview manually if needed.",
        );
        toast({
          text: "Generation succeeded, but we couldn't prepare the image for saving.",
          kind: "err",
        });
      }
    } catch (err) {
      console.error(err);
      const apiErr = err as ApiError;
      const friendly = describeError(apiErr.code, apiErr.details || apiErr.message);
      const message = `Generation failed: ${friendly}`;
      setErrorMessage(message);
      toast({ text: message, kind: "err" });
    } finally {
      setIsGenerating(false);
    }
  }

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSaving) return;

    if (!generatedFile) {
      toast({ text: "Generate an image first.", kind: "err" });
      return;
    }

    setIsSaving(true);
    try {
      const row = await uploadNavatar(generatedFile, name || undefined);
      setActiveNavatarId(row.id);
      toast({ text: "Saved ✓", kind: "ok" });
      const methodProvider = usedProvider ?? provider;
      void logEvent("avatar.saved", { method: "generate", provider: methodProvider, id: row.id });
      nav("/navatar");
    } catch (error) {
      console.error(error);
      toast({ text: "Save failed", kind: "err" });
    } finally {
      setIsSaving(false);
    }
  }

  const canSave = Boolean(generatedFile) && !isSaving;
  const cardTitle = name.trim() || "My Navatar";

  return (
    <main className="page-pad mx-auto max-w-4xl p-4">
      <div className="bcRow">
        <Breadcrumbs
          items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Describe & Generate" }]}
        />
      </div>
      <h1 className="pageTitle mt-6 mb-12">Describe &amp; Generate</h1>
      <BackToMyNavatar />
      <NavatarTabs context="subpage" />
      <form
        onSubmit={onSave}
        className="mx-auto mt-6 grid w-full max-w-2xl justify-items-center gap-5"
      >
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className={`${pill} ${provider === "openai" ? pillActive : ""}`}
            onClick={() => setProvider("openai")}
            disabled={isGenerating || isSaving}
          >
            OpenAI
          </button>
          <button
            type="button"
            className={`${pill} ${provider === "huggingface" ? pillActive : ""}`}
            onClick={() => setProvider("huggingface")}
            disabled={isGenerating || isSaving}
          >
            Hugging Face
          </button>
          <button
            type="button"
            className={`${pill} ${provider === "deepai" ? pillActive : ""}`}
            onClick={() => setProvider("deepai")}
            disabled={isGenerating || isSaving}
          >
            DeepAI
          </button>
          <button
            type="button"
            className={`${pill} ${provider === "basic" ? pillActive : ""}`}
            onClick={() => setProvider("basic")}
            disabled={isGenerating || isSaving}
          >
            Basic (Avatar)
          </button>
        </div>

        {errorMessage && (
          <p className="w-full rounded-2xl bg-red-50 px-5 py-3 text-sm font-medium text-red-600 shadow-sm">
            {errorMessage}
          </p>
        )}

        {provider === "basic" ? (
          <input
            className={input}
            placeholder="Name or seed for your avatar"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            disabled={isGenerating || isSaving}
          />
        ) : (
          <textarea
            className={`${input} min-h-[120px] resize-y`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your Navatar…"
            rows={4}
            disabled={isGenerating || isSaving}
          />
        )}

        {provider !== "basic" && (
          <div className="w-full">
            <label className="mb-2 block text-sm font-semibold text-slate-600">Size</label>
            <div className="flex gap-2">
              {SIZE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${pill} ${size === option ? pillActive : ""} flex-1 justify-center`}
                  onClick={() => setSize(option)}
                  disabled={isGenerating || isSaving}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        <button className={generateButton} type="button" onClick={onGenerate} disabled={isGenerating || isSaving}>
          {isGenerating ? "Generating…" : "Generate"}
        </button>

        <NavatarCard src={previewUrl ?? undefined} title={cardTitle} />

        <input
          className={input}
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSaving}
        />
        <button className={saveButton} type="submit" disabled={!canSave}>
          {isSaving ? "Saving…" : "Save"}
        </button>
      </form>
      {previewUrl && usedProvider && (
        <p className="mt-6 text-center text-sm text-slate-500">
          Generated with {formatProviderName(usedProvider)}.
        </p>
      )}
    </main>
  );
}

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";

type Provider = "openai" | "stability" | "huggingface" | "deepai" | "basic";

const PROVIDERS: Provider[] = ["openai", "stability", "huggingface", "deepai", "basic"];

function cls(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

function Pill({ active, children, onClick }: { active?: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cls("nv-pill", active ? "nv-pill--active" : "nv-pill--idle")}
    >
      {children}
    </button>
  );
}

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button
      {...rest}
      className={cls("nv-btn", "nv-btn--primary", props.disabled && "nv-btn--disabled", className)}
    />
  );
}

function helpFor(p: Provider) {
  switch (p) {
    case "basic":
      return "Seed / Name";
    default:
      return "Prompt";
  }
}

function endpointFor(p: Provider) {
  switch (p) {
    case "openai":
      return "/.netlify/functions/openai-generate";
    case "stability":
      return "/.netlify/functions/stability-generate";
    case "huggingface":
      return "/.netlify/functions/hf-generate";
    case "deepai":
      return "/.netlify/functions/deepai-generate";
    case "basic":
      return "/.netlify/functions/multavatar-generate";
  }
}

const ERROR_MESSAGES: Record<string, string> = {
  deepai_quota: "DeepAI quota reached. Try again later or switch providers.",
  huggingface_quota: "Hugging Face quota reached. Try again later or switch providers.",
  stability_error: "Stability AI is unavailable right now. Please try another provider.",
  openai_400: "OpenAI rejected the request. Adjust your prompt or size and retry.",
  endpoint_404: "This provider is not configured. Double-check deployment setup.",
  unknown_error: "Something went wrong. Please try again.",
  network_error: "Network error. Check your connection and try again.",
  unexpected_response: "The provider returned an unexpected response.",
};

function friendlyError(raw: any): string {
  const t = typeof raw === "string" ? raw : raw?.error || raw?.detail || raw?.message || "";
  if (/quota|limit/i.test(t) && /deepai/i.test(t)) return "deepai_quota";
  if (/quota|limit/i.test(t) && /(huggingface|inference)/i.test(t)) return "huggingface_quota";
  if (/stability/i.test(t)) return "stability_error";
  if (/^4\d\d$/.test(String(raw?.status)) || /bad request|400/i.test(t)) return "openai_400";
  if (/404/i.test(t)) return "endpoint_404";
  if (typeof t === "string" && /<[^>]+>/.test(t)) return "unknown_error";
  return t || "unknown_error";
}

export default function NavatarGenerate() {
  const [provider, setProvider] = useState<Provider>("openai");
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [name, setName] = useState("");
  const [img, setImg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setErr(null);
    setImg(null);
  }, [provider]);

  const canSubmit = useMemo(() => {
    if (busy) return false;
    if (provider === "basic") return name.trim().length > 0;
    return prompt.trim().length > 0;
  }, [busy, provider, prompt, name]);

  function toBase64(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      const slice = bytes.subarray(i, Math.min(i + chunk, bytes.length));
      binary += String.fromCharCode(...slice);
    }
    return btoa(binary);
  }

  async function onGenerate(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setImg(null);

    try {
      const body =
        provider === "basic"
          ? { seed: name.trim(), size: size.trim() }
          : { prompt: prompt.trim(), size: size.trim() };

      const res = await fetch(endpointFor(provider), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!res.ok) {
        const raw = contentType.includes("json")
          ? await res.json().catch(() => ({}))
          : await res.text().catch(() => "");
        const friendly = friendlyError(raw);
        setErr(ERROR_MESSAGES[friendly] ?? friendly);
        return;
      }

      if (contentType.startsWith("image/")) {
        const buf = await res.arrayBuffer();
        const b64 = toBase64(buf);
        setImg(`data:${contentType};base64,${b64}`);
      } else {
        const json = await res.json();
        const url = json?.image || json?.dataUrl || json?.data_url || json?.url;
        if (typeof url === "string") setImg(url);
        else setErr(ERROR_MESSAGES.unexpected_response);
      }
    } catch (e: any) {
      const friendly = friendlyError(e?.message || "network_error");
      setErr(ERROR_MESSAGES[friendly] ?? friendly);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="pageRoot">
      <h1 className="nv-title">Describe &amp; Generate</h1>

      <div className="nv-pillRow">
        {PROVIDERS.map((p) => (
          <Pill key={p} active={provider === p} onClick={() => setProvider(p)}>
            {p === "basic" ? "Basic (Avatar)" : p[0].toUpperCase() + p.slice(1)}
          </Pill>
        ))}
      </div>

      <form onSubmit={onGenerate} className="nv-form">
        <label className="nv-label">{helpFor(provider)}</label>
        {provider === "basic" ? (
          <input
            className="nv-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., turtle-hero"
          />
        ) : (
          <textarea
            className="nv-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your Navatar..."
            rows={3}
          />
        )}

        <label className="nv-label">Size</label>
        <input
          className="nv-input"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="WIDTHxHEIGHT (e.g., 1024x1024)"
        />
        <div className="nv-hint">Format: WIDTHxHEIGHT (e.g., 1024x1024)</div>

        <PrimaryButton type="submit" disabled={!canSubmit}>
          {busy ? "Generating..." : "Generate"}
        </PrimaryButton>
      </form>

      <div className="nv-result">
        <div className="nv-card">
          {img ? (
            <img src={img} alt="My Navatar" className="nv-img" />
          ) : (
            <div className="nv-placeholder">My Navatar</div>
          )}
        </div>
        {err && <div className="nv-error">Generation failed: {err}</div>}
      </div>
    </main>
  );
}

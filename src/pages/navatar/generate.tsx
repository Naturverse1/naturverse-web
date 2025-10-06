import { useState } from "react";
import { postJSON } from "../../lib/req";
import "../../styles/ui.css";

type Provider = "openai" | "huggingface" | "deepai" | "basic";

const PROVIDERS: { key: Provider; label: string; endpoint: string }[] = [
  {
    key: "openai",
    label: "OpenAI",
    endpoint: "/.netlify/functions/openai-generate",
  },
  {
    key: "huggingface",
    label: "Hugging Face",
    endpoint: "/.netlify/functions/hf-generate",
  },
  {
    key: "deepai",
    label: "DeepAI",
    endpoint: "/.netlify/functions/deepai-generate",
  },
  {
    key: "basic",
    label: "Basic (Avatar)",
    endpoint: "/.netlify/functions/multavatar-generate",
  },
];

export default function GeneratePage() {
  const [provider, setProvider] = useState<Provider>("openai");
  const [prompt, setPrompt] = useState<string>(
    "Cartoon action hero frog with a cape",
  );
  const [seed, setSeed] = useState<string>("turtle-hero");
  const [size, setSize] = useState<string>("1024x1024");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const onGenerate = async () => {
    setErr("");
    setImage("");
    setLoading(true);
    const ep = PROVIDERS.find((p) => p.key === provider)!.endpoint;
    const payload = provider === "basic" ? { seed } : { prompt, size };
    const { json } = await postJSON(ep, payload);
    setLoading(false);

    if (json?.ok && json?.image) {
      setImage(json.image);
      return;
    }
    setErr(humanError(json?.error || "unknown_error"));
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "1.25rem" }}>
      <h1
        style={{
          fontSize: "2.25rem",
          fontWeight: 800,
          color: "#1f2937",
          marginBottom: "1rem",
        }}
      >
        Describe &amp; Generate
      </h1>

      <div className="pills" style={{ marginBottom: ".75rem" }}>
        {PROVIDERS.map((p) => (
          <button
            key={p.key}
            className={`pill ${provider === p.key ? "active" : ""}`}
            onClick={() => setProvider(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {provider === "basic" ? (
        <>
          <input
            className="input"
            placeholder="Seed / Name (e.g., turtle-hero)"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
          <div className="hint">Uses Multiavatar by seed.</div>
        </>
      ) : (
        <>
          <textarea
            className="textarea"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your Navatar..."
          />
          <div style={{ display: "flex", gap: ".5rem", marginTop: ".5rem" }}>
            {["512x512", "1024x1024", "2048x2048"].map((s) => (
              <button
                key={s}
                className={`pill ${size === s ? "active" : ""}`}
                onClick={() => setSize(s)}
              >
                {s.split("x")[0]}
              </button>
            ))}
          </div>
          <div className="hint">Format: WIDTHxHEIGHT (e.g., 1024x1024)</div>
        </>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button className="btn-primary" disabled={loading} onClick={onGenerate}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      <div className="result-card">
        {image ? (
          <img alt="Navatar" src={image} />
        ) : (
          <div style={{ color: "#94a3b8", fontWeight: 700 }}>My Navatar</div>
        )}
      </div>

      {err ? <div className="error">Generation failed: {err}</div> : null}
    </div>
  );
}

function humanError(tag: string) {
  switch (tag) {
    case "missing_prompt":
      return "Please enter a prompt.";
    case "openai_400":
      return "OpenAI rejected the request (400).";
    case "openai_401":
      return "OpenAI key is invalid.";
    case "openai_quota":
      return "OpenAI quota is exhausted.";
    case "hf_quota":
      return "Hugging Face quota is exhausted.";
    case "deepai_quota":
      return "DeepAI credits are exhausted.";
    case "timeout_504":
      return "Provider took too long (504). Try a smaller size.";
    default:
      return tag.replace(/_/g, " ");
  }
}

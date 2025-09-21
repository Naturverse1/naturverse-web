import { useEffect, useMemo, useState } from "react";

import {
  DEFAULT_NEGATIVE_PROMPT,
  STYLE_PRESETS,
  generateWithStability,
  type StabilityGenerateResult,
} from "@/lib/navatar/stability";

const DAILY_CREDITS = 25;
const SEED_LOCK_KEY = "naturverse.seed.lock";
const SEED_VALUE_KEY = "naturverse.seed.value";

function randomSeed() {
  return Math.floor(Math.random() * 0xffff_ffff);
}

function downloadBlob(blob: Blob, filename = "navatar.png") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function loadSupabaseClient() {
  if (typeof window === "undefined") return null;
  try {
    const mod = await import("@/lib/supabaseClient");
    return mod.supabase ?? null;
  } catch {
    return null;
  }
}

type GenOptions = {
  prompt: string;
  style_preset?: string;
  avoid?: string;
  seed?: number;
  keepSeed?: boolean;
};

function extractBlob(result: Blob | StabilityGenerateResult) {
  return result instanceof Blob ? result : result.blob;
}

function extractRemaining(result: Blob | StabilityGenerateResult) {
  if (result instanceof Blob) return undefined;
  return result.remaining ?? undefined;
}

export default function NavatarGeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [avoid, setAvoid] = useState("");
  const [stylePreset, setStylePreset] = useState<string | undefined>(undefined);

  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [gridUrls, setGridUrls] = useState<string[]>([]);
  const [status, setStatus] = useState<null | string>(null);
  const [error, setError] = useState<string | null>(null);

  const [seedLocked, setSeedLocked] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem(SEED_LOCK_KEY);
    return stored ? stored === "1" : true;
  });
  const [seed, setSeed] = useState<number | undefined>(() => {
    if (typeof window === "undefined") return randomSeed();
    const stored = window.localStorage.getItem(SEED_VALUE_KEY);
    if (!stored) return randomSeed();
    const parsed = Number(stored);
    return Number.isFinite(parsed) ? parsed : randomSeed();
  });

  const [creditsLeft, setCreditsLeft] = useState<number | null>(null);
  const working = Boolean(status);

  useEffect(() => {
    let isActive = true;

    (async () => {
      const supabase = await loadSupabaseClient();
      if (!isActive) return;

      if (!supabase) {
        setCreditsLeft(DAILY_CREDITS);
        return;
      }

      try {
        const today = new Date().toISOString().slice(0, 10);
        const { data: session } = await supabase.auth.getSession();
        if (!isActive) return;
        const userId = session?.session?.user?.id;
        if (!userId) {
          setCreditsLeft(DAILY_CREDITS);
          return;
        }

        const { count, error: countError } = await supabase
          .from("generated_images")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .gte("created_at", `${today}T00:00:00Z`);

        if (!isActive) return;
        if (countError) throw countError;

        const used = count ?? 0;
        setCreditsLeft(Math.max(0, DAILY_CREDITS - used));
      } catch {
        if (isActive) {
          setCreditsLeft(DAILY_CREDITS);
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SEED_LOCK_KEY, seedLocked ? "1" : "0");
  }, [seedLocked]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof seed === "number") {
      window.localStorage.setItem(SEED_VALUE_KEY, String(seed));
    }
  }, [seed]);

  useEffect(() => {
    return () => {
      if (imgUrl) {
        URL.revokeObjectURL(imgUrl);
      }
      gridUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imgUrl, gridUrls]);

  const baseNegativePrompt = useMemo(() => DEFAULT_NEGATIVE_PROMPT, []);

  function effectiveSeed(): number | undefined {
    return seedLocked ? seed : undefined;
  }

  function combineAvoid(value?: string) {
    const extra = value?.trim();
    if (!extra) return baseNegativePrompt;
    return `${baseNegativePrompt}, ${extra}`;
  }

  async function doGenerate(opts: GenOptions) {
    setError(null);
    setStatus("contacting Stability…");
    try {
      const result = (await generateWithStability({
        prompt: opts.prompt,
        negativePrompt: combineAvoid(opts.avoid),
        seed: opts.keepSeed ? opts.seed : undefined,
        size: "1024x1024",
        style: opts.style_preset,
      })) as Blob | StabilityGenerateResult;

      setStatus("rendering image…");
      const blob = extractBlob(result);
      const url = URL.createObjectURL(blob);
      setImgUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return url;
      });

      const remaining = extractRemaining(result);
      if (typeof remaining === "number") {
        setCreditsLeft(Math.max(0, remaining));
      } else {
        setCreditsLeft((c) => (c == null ? c : Math.max(0, c - 1)));
      }

      setStatus(null);
    } catch (e: any) {
      setStatus(null);
      setError(
        e?.message ??
          "Generation failed. Please try again with a simpler prompt."
      );
    }
  }

  async function handleGenerate() {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("Please describe your Navatar.");
      return;
    }
    await doGenerate({
      prompt: trimmed,
      style_preset: stylePreset,
      avoid: avoid.trim() || undefined,
      seed: effectiveSeed(),
      keepSeed: seedLocked,
    });
    if (!seedLocked) {
      setSeed(randomSeed());
    }
  }

  async function handleGrid() {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setError(null);
    setStatus("generating 4 images…");
    try {
      const seeds = new Array(4).fill(0).map((_, i) => {
        const base = seedLocked ? seed ?? randomSeed() : randomSeed();
        return (base + i) >>> 0;
      });
      const results = await Promise.all(
        seeds.map((s) =>
          generateWithStability({
            prompt: trimmed,
            negativePrompt: combineAvoid(avoid.trim() || undefined),
            seed: s,
            size: "1024x1024",
            style: stylePreset,
          })
        )
      );

      const urls = results.map((res) => {
        const blob = extractBlob(res as Blob | StabilityGenerateResult);
        return URL.createObjectURL(blob);
      });

      gridUrls.forEach((u) => URL.revokeObjectURL(u));
      setGridUrls(urls);

      const remaining = results
        .map((res) => extractRemaining(res as Blob | StabilityGenerateResult))
        .find((value) => typeof value === "number");
      if (typeof remaining === "number") {
        setCreditsLeft(Math.max(0, remaining));
      } else {
        setCreditsLeft((c) => (c == null ? c : Math.max(0, c - 4)));
      }

      setStatus(null);
    } catch (e: any) {
      setStatus(null);
      setError(
        e?.message ?? "Couldn’t make a grid right now. Please try again."
      );
    }
  }

  function handleDownload() {
    if (!imgUrl) return;
    fetch(imgUrl)
      .then((r) => r.blob())
      .then((b) => downloadBlob(b, "navatar.png"));
  }

  function handleUseAsNavatar() {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="nv-gen">
      <div className="nv-gen__preview">
        {imgUrl ? (
          <img src={imgUrl} alt="Preview" />
        ) : (
          <div className="nv-gen__placeholder">My Navatar</div>
        )}
      </div>

      <div className="nv-gen__actions">
        <button className="btn primary" onClick={handleGenerate} disabled={working}>
          {working ? "Working…" : "Regenerate"}
        </button>
        <button className="btn" onClick={handleGrid} disabled={working}>
          ×4 Grid
        </button>
        <button className="btn" onClick={handleDownload} disabled={!imgUrl}>
          Download PNG
        </button>
        <button className="btn" onClick={handleUseAsNavatar} disabled={!imgUrl}>
          Use as Navatar
        </button>
      </div>

      <div className="nv-gen__meta">
        <div className="seed">
          <label>
            <input
              type="checkbox"
              checked={seedLocked}
              onChange={(e) => setSeedLocked(e.target.checked)}
            />
            Keep style consistent (seed)
          </label>
          {seedLocked && <span className="seed-chip">Seed #{seed}</span>}
          {!seedLocked && (
            <button
              className="btn tiny"
              onClick={() => setSeed(randomSeed())}
              title="New random seed for next run"
            >
              Shuffle seed
            </button>
          )}
        </div>
        <div className="credits">
          Credits left: <strong>{creditsLeft == null ? DAILY_CREDITS : creditsLeft}</strong>
          <span className="muted"> / {DAILY_CREDITS} per day</span>
        </div>
      </div>

      <div className="nv-gen__form">
        <label className="lbl">Describe your Navatar</label>
        <textarea
          value={prompt}
          placeholder="e.g., funny cartoon frog"
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />

        <label className="lbl">Style preset</label>
        <select
          value={stylePreset ?? ""}
          onChange={(e) =>
            setStylePreset(e.target.value ? e.target.value : undefined)
          }
        >
          <option value="">(Let it choose)</option>
          {STYLE_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>

        <details className="adv">
          <summary>Advanced prompt controls</summary>
          <label className="lbl">Add things to avoid (optional)</label>
          <input
            value={avoid}
            placeholder="e.g., text, logos, photorealistic, gore"
            onChange={(e) => setAvoid(e.target.value)}
          />
        </details>
      </div>

      {gridUrls.length > 0 && (
        <div className="nv-grid">
          {gridUrls.map((u, i) => (
            <button
              key={u}
              className="nv-grid__cell"
              onClick={() => {
                setImgUrl((old) => {
                  if (old) URL.revokeObjectURL(old);
                  return u;
                });
                setGridUrls((arr) => arr.filter((x) => x !== u));
              }}
            >
              <img src={u} alt={`Option ${i + 1}`} />
            </button>
          ))}
        </div>
      )}

      {status && <div className="toast info">{status}</div>}
      {error && <div className="toast error">{error}</div>}

      <style>{`
        .nv-gen { max-width: 720px; margin: 0 auto; padding: 1rem; }
        .nv-gen__preview { display:flex; justify-content:center; margin: 0 0 12px; }
        .nv-gen__preview img { width: 320px; height: 320px; object-fit: cover; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,.08); }
        .nv-gen__placeholder { width:320px; height:320px; border-radius:16px; background:#f3f5f7; color:#94a3b8; display:flex; align-items:center; justify-content:center; font-weight:600; }
        .nv-gen__actions { display:flex; gap:.5rem; flex-wrap:wrap; margin: 6px 0 10px;}
        .btn { border:1px solid #d1d5db; background:#fff; padding:.55rem .8rem; border-radius:10px; font-weight:600; }
        .btn.primary { background:#3155ff; color:#fff; border-color:#3155ff; }
        .btn.tiny { padding:.25rem .5rem; font-size:.85rem; }
        .nv-gen__meta { display:flex; align-items:center; justify-content:space-between; gap:1rem; margin: 4px 0 12px; flex-wrap: wrap; }
        .seed { display:flex; align-items:center; gap:.5rem; }
        .seed-chip { background:#eef2ff; color:#3730a3; border:1px solid #c7d2fe; padding:.15rem .5rem; border-radius:999px; font-size:.85rem; }
        .credits { font-weight:600; }
        .muted { color:#94a3b8; font-weight:400; margin-left:2px; }
        .nv-gen__form { display:grid; gap:.5rem; margin: 12px 0; }
        .lbl { font-weight:700; font-size:.95rem; }
        textarea { resize:vertical; }
        input, textarea, select { border:1px solid #d1d5db; border-radius:10px; padding:.6rem .7rem; }
        .adv { margin-top:.5rem; }
        .nv-grid { margin: 14px 0; display:grid; grid-template-columns:repeat(2, 1fr); gap:8px; }
        .nv-grid__cell { padding:0; overflow:hidden; border-radius:12px; cursor:pointer; border:none; }
        .nv-grid__cell img { width:100%; height:100%; object-fit:cover; display:block; }
        .toast { margin-top:8px; padding:.6rem .8rem; border-radius:10px; border:1px solid; }
        .toast.info { background:#eff6ff; color:#1e3a8a; border-color:#bfdbfe; }
        .toast.error { background:#fef2f2; color:#7f1d1d; border-color:#fecaca; }
      `}</style>
    </div>
  );
}

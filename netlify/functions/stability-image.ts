import type { Handler } from "@netlify/functions";
import { preflight, withCors } from "./_utils/cors";

// v1-6 often 404s now. SDXL works on current accounts, override via STABILITY_ENGINE.
const DEFAULT_ENGINE = process.env.STABILITY_ENGINE || "sdxl-1024-v1-0";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return preflight();
  }

  if (event.httpMethod !== "POST") {
    return withCors({ ok: false, error: "Method not allowed" }, 405);
  }

  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    return withCors({ ok: false, error: "STABILITY_API_KEY missing" }, 500);
  }

  let payload: any = {};
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return withCors({ ok: false, error: "Invalid JSON" }, 400);
  }

  const prompt = typeof payload.prompt === "string" ? payload.prompt : "";
  const engine = normaliseString(payload.model) || DEFAULT_ENGINE;
  const width = normaliseNumber(payload.width, 512);
  const height = normaliseNumber(payload.height, 512);
  const steps = normaliseNumber(payload.steps, 30);
  const cfgScale = normaliseNumber(payload.cfg_scale, 7);

  if (!prompt.trim()) {
    return withCors({ ok: false, error: "Missing prompt" }, 400);
  }

  try {
    const response = await fetch(`https://api.stability.ai/v1/generation/${engine}/text-to-image`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        height,
        width,
        steps,
        cfg_scale: cfgScale,
        text_prompts: [{ text: prompt }],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return withCors({ ok: false, error: `Stability ${response.status}: ${text}` }, 502);
    }

    const data = await response.json();
    const base64 = data?.artifacts?.[0]?.base64;

    if (!base64) {
      return withCors({ ok: false, error: "Stability: empty image" }, 502);
    }

    return withCors({ ok: true, image_base64: `data:image/png;base64,${base64}` });
  } catch (error: any) {
    return withCors({ ok: false, error: error?.message || "Stability handler error" }, 500);
  }
};

function normaliseNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function normaliseString(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return "";
}

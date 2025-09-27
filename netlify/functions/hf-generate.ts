import type { Handler } from "@netlify/functions";

const HF_MODEL = process.env.HF_MODEL_ID || "black-forest-labs/FLUX.1-dev";
const NEGATIVE = [
  "photo, photorealistic, hyperrealistic",
  "text, caption, logo, watermark, signature",
  "grain, noise, artifacts, extra limbs, deformed hands, gore, violence, guns",
].join(", ");

type Req = { prompt?: string; onBrand?: boolean; seed?: number; keepSeed?: boolean };

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors(), body: "" };
  if (event.httpMethod !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  try {
    const API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_API_TOKEN || "";
    if (!API_KEY) return json({ ok: false, error: "Missing HUGGINGFACE_API_KEY" }, 500);

    const { prompt, onBrand = true, seed, keepSeed }: Req = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") return json({ ok: false, error: "Missing prompt" }, 400);

    const brand = [
      "cute character, navatar style, bright friendly palette",
      "big expressive eyes, rounded shapes, thick clean outlines",
      "storybook illustration, flat lighting, soft shading",
      "kid-friendly, sticker-ready, high contrast, no tiny details",
    ].join(", ");

    const finalPrompt = onBrand ? `${prompt.trim()}, ${brand}` : prompt.trim();
    const effectiveSeed = keepSeed ? clampSeed(seed) : undefined;

    const resp = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json", Accept: "image/png" },
      body: JSON.stringify({
        inputs: finalPrompt,
        parameters: { negative_prompt: NEGATIVE, width: 1024, height: 1024, num_inference_steps: 28, guidance_scale: 5, seed: effectiveSeed },
      }),
    });

    const ct = resp.headers.get("content-type") || "";
    if (ct.startsWith("image/")) {
      const buf = Buffer.from(await resp.arrayBuffer());
      return json({ ok: true, provider: "huggingface", dataUrl: `data:image/png;base64,${buf.toString("base64")}` });
    }

    let raw = "";
    try { raw = await resp.text(); } catch {}
    return json({ ok: false, provider: "huggingface", status: resp.status, error: raw || "HF error" }, resp.status);
  } catch (err: any) {
    return json({ ok: false, error: String(err?.message || err) }, 500);
  }
};

function clampSeed(v: any) {
  if (typeof v !== "number" || !Number.isFinite(v)) return undefined;
  return Math.max(0, Math.min(0xffff_ffff, Math.floor(v)));
}
function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type,authorization",
  };
}
function json(body: any, statusCode = 200) {
  return { statusCode, headers: { "Content-Type": "application/json", ...cors() }, body: JSON.stringify(body) };
}

import type { Handler } from "@netlify/functions";

const HF_MODEL = "black-forest-labs/FLUX.1-dev";

type ReqBody = {
  prompt?: string;
  onBrand?: boolean;
  seed?: number;
  keepSeed?: boolean;
};

const BRAND_STYLE = [
  "cute character, navatar style, bright friendly palette",
  "big expressive eyes, rounded shapes, thick clean outlines",
  "storybook illustration, flat lighting, soft shading",
  "kid-friendly, sticker-ready, high contrast, no tiny details",
].join(", ");

const NEGATIVE = [
  "photo, photorealistic, hyperrealistic",
  "text, caption, letters, logo, watermark, signature",
  "grain, noise, artifacts, extra limbs, deformed hands, gore, violence, guns",
].join(", ");

function clampSeed(v: unknown) {
  if (typeof v !== "number" || !Number.isFinite(v)) return undefined;
  const n = Math.max(0, Math.min(0xffff_ffff, Math.floor(v)));
  return n;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: "",
    };
  }

  try {
    const API_KEY =
      process.env.HUGGINGFACE_API_KEY || process.env.HF_API_TOKEN || "";
    if (!API_KEY) {
      return json({ ok: false, error: "Missing HUGGINGFACE_API_KEY" }, 500);
    }

    const { prompt, onBrand = true, seed, keepSeed }: ReqBody =
      JSON.parse(event.body || "{}");

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return json({ ok: false, error: "Missing prompt" }, 400);
    }

    const finalPrompt = onBrand ? `${prompt.trim()}. ${BRAND_STYLE}` : prompt.trim();
    const negativePrompt = NEGATIVE;
    const effectiveSeed = keepSeed ? clampSeed(seed) : undefined;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Accept: "image/png",
    };

    const res = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          inputs: finalPrompt,
          parameters: {
            negative_prompt: negativePrompt,
            width: 1024,
            height: 1024,
            num_inference_steps: 28,
            guidance_scale: 5,
            seed: effectiveSeed,
          },
        }),
      }
    );

    const ct = res.headers.get("content-type") || "";

    if (!res.ok) {
      let raw = "";
      try {
        raw = await res.text();
      } catch {}
      return json({ ok: false, error: "Hugging Face error", raw }, res.status);
    }

    if (ct.startsWith("image/")) {
      const buf = Buffer.from(await res.arrayBuffer());
      const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
      return json({ ok: true, image: dataUrl, provider: "huggingface" });
    }

    const raw = await res.text();
    return json({ ok: false, error: "Unexpected response", raw }, 502);
  } catch (err: any) {
    return json({ ok: false, error: String(err?.message || err) }, 500);
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type,authorization",
  };
}

function json(body: any, statusCode = 200) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
    body: JSON.stringify(body),
  };
}

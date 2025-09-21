import type { Handler } from "@netlify/functions";

const HF_ENDPOINT =
  "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";

const BRAND_STYLE =
  process.env.NAVATAR_BRAND_STYLE ??
  [
    "cute character, navatar style, bright friendly palette,",
    "big expressive eyes, rounded shapes, thick clean outlines,",
    "storybook illustration, flat lighting, soft shading,",
    "kid-friendly, sticker-ready, high contrast, no tiny details",
  ].join(" ");

const DEFAULT_NEGATIVE =
  process.env.NAVATAR_NEGATIVE ??
  [
    "photo, photorealistic, hyperrealistic,",
    "text, caption, letters, logo, watermark, signature,",
    "grain, noise, artifacts, extra limbs, deformed hands,",
    "gore, violence, weapons",
  ].join(", ");

function clampSeed(n?: unknown) {
  if (typeof n !== "number" && typeof n !== "string") return undefined;
  const x = Math.max(0, Math.min(2 ** 32 - 1, Math.floor(Number(n))));
  return Number.isFinite(x) ? x : undefined;
}

export const handler: Handler = async (event) => {
  try {
    const key = process.env.HUGGINGFACE_API_KEY;
    if (!key) {
      return json(500, { errors: ["Missing HUGGINGFACE_API_KEY"] });
    }
    if (event.httpMethod !== "POST") {
      return json(405, { errors: ["Method not allowed"] });
    }

    const { prompt, onBrand = true, avoid = "", seed } = parseJSON(event.body);

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return json(400, { errors: ["Missing prompt"] });
    }

    const finalPrompt = onBrand ? `${prompt.trim()}. ${BRAND_STYLE}` : prompt.trim();
    const negative_prompt = [DEFAULT_NEGATIVE, avoid].filter(Boolean).join(", ");
    const effectiveSeed = clampSeed(seed);

    const body = {
      inputs: finalPrompt,
      parameters: {
        negative_prompt,
        width: 1024,
        height: 1024,
        guidance_scale: 5,
        num_inference_steps: 28,
        ...(effectiveSeed !== undefined ? { seed: effectiveSeed } : {}),
      },
    };

    const res = await fetch(HF_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "image/png",
      },
      body: JSON.stringify(body),
    });

    const ctype = res.headers.get("content-type") || "";
    if (!res.ok) {
      const raw = await res.text();
      return json(res.status, { errors: ["Hugging Face error"], raw });
    }
    if (!ctype.includes("image/")) {
      const raw = await res.text();
      return json(502, {
        errors: ["Hugging Face returned non-image response"],
        raw,
      });
    }

    const buf = Buffer.from(await res.arrayBuffer());
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
      body: buf.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    return json(500, { errors: ["Server error"], detail: `${err}` });
  }
};

function parseJSON(s?: string | null) {
  try {
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
}

function json(code: number, data: unknown) {
  return {
    statusCode: code,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

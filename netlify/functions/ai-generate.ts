// Calls your HF Space JSON API and returns a simple envelope for the UI.
import type { Handler } from "@netlify/functions";

const SPACE_URL = process.env.HF_SPACE_URL || "";

const naturverseStyle =
  "Cute Creature style, adorable creature design, plush textures, rounded silhouettes, cozy lighting, soft gradients, family-friendly, bright friendly palette, big expressive eyes, thick clean outlines, storybook illustration, kid-friendly, high contrast, no tiny details";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: "",
    };
  }

  try {
    if (!SPACE_URL) return json(500, { errors: ["HF_SPACE_URL not set"] });

    const { prompt, seed, width = 1024, height = 1024, onBrand }: Record<string, unknown> =
      JSON.parse(event.body || "{}");

    if (typeof prompt !== "string" || !prompt.trim()) {
      return json(400, { errors: ["Missing prompt"] });
    }

    const shouldUseBrand = onBrand !== false;
    const finalPrompt = shouldUseBrand ? `${prompt.trim()}. ${naturverseStyle}` : prompt.trim();

    const body = {
      prompt: finalPrompt,
      width,
      height,
      steps: 28,
      guidance: 5.5,
      seed,
      negative:
        "photo, photorealistic, hyperrealistic, realistic skin, words, text, letters, caption, logo, watermark, gore, violence",
    };

    const r = await fetch(`${SPACE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const raw = await r.text();
      return json(502, { errors: ["Space request failed"], raw });
    }

    const data = (await r.json()) as { image?: string; seed?: number };
    if (!data?.image) {
      return json(502, { errors: ["Space response missing image"] });
    }

    return json(200, { imageDataUrl: data.image, seed: data.seed });
  } catch (err: any) {
    return json(500, { errors: [err?.message || String(err)] });
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Cache-Control": "no-store",
  } as const;
}

function json(status: number, body: unknown) {
  return {
    statusCode: status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

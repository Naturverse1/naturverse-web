import type { Handler } from "@netlify/functions";

const BRAND_STYLE = [
  "cute character, navatar style, bright friendly palette,",
  "big expressive eyes, rounded shapes, thick clean outlines,",
  "storybook illustration, flat lighting, soft shading,",
  "kid-friendly, sticker-ready, high contrast, no tiny details",
].join(" ");

const NEGATIVE = [
  "photo, photorealistic, hyperrealistic,",
  "text, caption, letters, logo, watermark, signature,",
  "grain, noise, artifacts, extra limbs, deformed hands",
].join(", ");

const clampSeed = (s: unknown) => {
  if (typeof s !== "number" || !Number.isFinite(s)) return undefined;
  const n = Math.floor(s);
  return Math.min(0xffff_ffff, Math.max(0, n));
};

export const handler: Handler = async (event) => {
  try {
    const API_KEY = process.env.STABILITY_API_KEY;
    if (!API_KEY) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing STABILITY_API_KEY" }),
      };
    }

    const {
      prompt,
      onBrand = true,
      keepSeed,
      seed,
      avoid = "",
      stylePreset,
    } = JSON.parse(event.body || "{}");

    if (typeof prompt !== "string" || !prompt.trim()) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing prompt" }),
      };
    }

    const finalPrompt = onBrand ? `${prompt.trim()}. ${BRAND_STYLE}` : prompt.trim();
    const negative_prompt = [NEGATIVE, typeof avoid === "string" ? avoid.trim() : ""]
      .filter(Boolean)
      .join(", ");

    const effectiveSeed = keepSeed ? clampSeed(seed) : undefined;

    const bodyPayload: Record<string, unknown> = {
      model: "stable-image-ultra",
      prompt: finalPrompt,
      negative_prompt,
      output_format: "png",
      aspect_ratio: "1:1",
    };
    if (typeof stylePreset === "string" && stylePreset) bodyPayload.style_preset = stylePreset;
    if (typeof effectiveSeed === "number") bodyPayload.seed = effectiveSeed;

    const res = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Accept: "image/*, application/json",
        },
        body: JSON.stringify(bodyPayload),
      }
    );

    const ct = res.headers.get("content-type") || "";
    if (res.ok && ct.startsWith("image/")) {
      const buf = Buffer.from(await res.arrayBuffer());
      return {
        statusCode: 200,
        isBase64Encoded: true,
        headers: { "Content-Type": ct, "Cache-Control": "no-store" },
        body: buf.toString("base64"),
      };
    }

    let err: any;
    try {
      err = await res.json();
    } catch {
      err = { message: await res.text() };
    }
    return {
      statusCode: res.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "stability_error", status: res.status, details: err }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "server_error", message: e?.message || String(e) }),
    };
  }
};

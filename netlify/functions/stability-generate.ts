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

const clampSeed = (seed: unknown): number | undefined => {
  if (typeof seed !== "number" || !Number.isFinite(seed)) return undefined;
  const clamped = Math.max(0, Math.min(0xffff_ffff, Math.floor(seed)));
  return clamped;
};

export const handler: Handler = async (event) => {
  try {
    const API_KEY = process.env.STABILITY_API_KEY;
    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing STABILITY_API_KEY" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const body = JSON.parse(event.body || "{}");
    const {
      prompt,
      negativePrompt,
      avoid = "",
      onBrand = true,
      seed,
      keepSeed,
      stylePreset,
      style,
    } = body ?? {};

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing prompt" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const trimmedPrompt = prompt.trim();
    const userNegative =
      typeof avoid === "string" && avoid.trim()
        ? avoid.trim()
        : typeof negativePrompt === "string"
        ? negativePrompt.trim()
        : "";

    const brandEnabled = typeof onBrand === "boolean" ? onBrand : true;

    const finalPrompt = brandEnabled
      ? `${trimmedPrompt}. ${BRAND_STYLE}`
      : trimmedPrompt;

    const negative = brandEnabled
      ? [NEGATIVE, userNegative].filter(Boolean).join(", ")
      : userNegative || undefined;

    const normalizedSeed = clampSeed(seed);
    const shouldKeepSeed = Boolean(keepSeed && typeof normalizedSeed === "number");

    const bodyPayload: Record<string, unknown> = {
      model: "stable-image-ultra",
      prompt: finalPrompt,
      style_preset: typeof stylePreset === "string" ? stylePreset : typeof style === "string" ? style : "comic-book",
      output_format: "png",
      aspect_ratio: "1:1",
    };

    if (negative) {
      bodyPayload.negative_prompt = negative;
    }

    if (shouldKeepSeed && typeof normalizedSeed === "number") {
      bodyPayload.seed = normalizedSeed;
    }

    const resp = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "image/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
    });

    const remaining = resp.headers.get("x-ratelimit-remaining");
    const contentType = resp.headers.get("content-type") || "";

    if (!resp.ok) {
      let errBody: unknown;
      if (contentType.includes("application/json")) {
        try {
          errBody = await resp.json();
        } catch {
          errBody = { error: "stability_error" };
        }
      } else {
        try {
          const text = await resp.text();
          errBody = { error: text || "stability_error" };
        } catch {
          errBody = { error: "stability_error" };
        }
      }

      return {
        statusCode: resp.status,
        body: JSON.stringify(errBody),
        headers: {
          "Content-Type": "application/json",
          ...(remaining ? { "x-ratelimit-remaining": remaining } : {}),
        },
      };
    }

    if (contentType.startsWith("image/")) {
      const buf = Buffer.from(await resp.arrayBuffer());
      return {
        statusCode: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-store",
          ...(remaining ? { "x-ratelimit-remaining": remaining } : {}),
        },
        body: buf.toString("base64"),
        isBase64Encoded: true,
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unexpected response from Stability" }),
      headers: {
        "Content-Type": "application/json",
        ...(remaining ? { "x-ratelimit-remaining": remaining } : {}),
      },
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "proxy_failure", detail: e?.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
};

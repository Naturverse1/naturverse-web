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

const jsonResponse = (
  statusCode: number,
  body: Record<string, unknown>,
  extraHeaders?: Record<string, string>
) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    ...(extraHeaders ?? {}),
  },
  body: JSON.stringify(body),
});

const extractImageBase64 = (payload: unknown): string | undefined => {
  if (!payload || typeof payload !== "object") return undefined;

  const direct = (payload as { image?: unknown }).image;
  if (typeof direct === "string" && direct) return direct;

  const images = (payload as { images?: unknown }).images;
  if (Array.isArray(images)) {
    for (const entry of images) {
      if (typeof entry === "string" && entry) return entry;
      if (entry && typeof entry === "object") {
        const value = (entry as { image?: unknown }).image;
        if (typeof value === "string" && value) return value;
        const base64 = (entry as { base64?: unknown }).base64;
        if (typeof base64 === "string" && base64) return base64;
      }
    }
  }

  return undefined;
};

export const handler: Handler = async (event) => {
  try {
    const API_KEY = process.env.STABILITY_API_KEY;
    if (!API_KEY) {
      return jsonResponse(500, { error: "Missing STABILITY_API_KEY" });
    }

    let body: any;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return jsonResponse(400, { error: "invalid_json" });
    }

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
      return jsonResponse(400, { error: "Missing prompt" });
    }

    const trimmedPrompt = prompt.trim();
    const userNegative =
      typeof avoid === "string" && avoid.trim()
        ? avoid.trim()
        : typeof negativePrompt === "string"
        ? negativePrompt.trim()
        : "";

    const brandEnabled = typeof onBrand === "boolean" ? onBrand : true;

    const finalPrompt = brandEnabled ? `${trimmedPrompt}. ${BRAND_STYLE}` : trimmedPrompt;

    const negative = brandEnabled
      ? [NEGATIVE, userNegative].filter(Boolean).join(", ")
      : userNegative || undefined;

    const normalizedSeed = clampSeed(seed);
    const shouldKeepSeed = Boolean(keepSeed && typeof normalizedSeed === "number");

    const payload: Record<string, unknown> = {
      prompt: finalPrompt,
      output_format: "png",
      aspect_ratio: "1:1",
      model: "sd3.5-large",
    };

    if (negative) {
      payload.negative_prompt = negative;
    }

    const preset =
      typeof stylePreset === "string"
        ? stylePreset
        : typeof style === "string"
        ? style
        : undefined;

    if (preset) {
      payload.style_preset = preset;
    }

    if (shouldKeepSeed && typeof normalizedSeed === "number") {
      payload.seed = normalizedSeed;
    }

    let upstream;
    try {
      upstream = await fetch("https://api.stability.ai/v2beta/stable-image/generate/core", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error: any) {
      return jsonResponse(502, { error: "proxy_failure", detail: error?.message });
    }

    const remaining = upstream.headers.get("x-ratelimit-remaining") || undefined;

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => "");
      return jsonResponse(
        upstream.status,
        { error: "stability_error", detail: errText },
        remaining ? { "x-ratelimit-remaining": remaining } : undefined
      );
    }

    let data: unknown;
    try {
      data = await upstream.json();
    } catch {
      return jsonResponse(
        502,
        { error: "invalid_response", detail: "Expected JSON payload" },
        remaining ? { "x-ratelimit-remaining": remaining } : undefined
      );
    }

    const base64 = extractImageBase64(data);
    if (!base64) {
      return jsonResponse(
        502,
        { error: "invalid_image", detail: "Missing base64 image from Stability" },
        remaining ? { "x-ratelimit-remaining": remaining } : undefined
      );
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        ...(remaining ? { "x-ratelimit-remaining": remaining } : {}),
      },
      body: JSON.stringify({ imageDataUrl: `data:image/png;base64,${base64}` }),
    };
  } catch (error: any) {
    return jsonResponse(500, { error: "proxy_failure", detail: error?.message });
  }
};

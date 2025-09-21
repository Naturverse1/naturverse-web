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
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Stability not configured" }),
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
    const brandEnabled = typeof onBrand === "boolean" ? onBrand : true;

    const finalPrompt = brandEnabled
      ? `${BRAND_STYLE}, ${trimmedPrompt}`
      : trimmedPrompt;

    const finalNegative =
      [brandEnabled ? NEGATIVE : "", avoid, negativePrompt]
        .map((value) => (typeof value === "string" ? value.trim() : ""))
        .filter(Boolean)
        .join(", ") || undefined;

    const normalizedSeed = clampSeed(seed);
    const shouldKeepSeed = Boolean(keepSeed && typeof normalizedSeed === "number");

    const bodyPayload: Record<string, unknown> = {
      model: "stable-image-ultra",
      prompt: finalPrompt,
      negative_prompt: finalNegative,
      aspect_ratio: "1:1",
      output_format: "png",
      style_preset:
        typeof stylePreset === "string"
          ? stylePreset
          : typeof style === "string"
          ? style
          : undefined,
      mode: "text-to-image",
    };

    if (shouldKeepSeed && typeof normalizedSeed === "number") {
      bodyPayload.seed = normalizedSeed;
    }

    const resp = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          Accept: "image/*",
        },
        body: JSON.stringify(bodyPayload),
      }
    );

    const remaining = resp.headers.get("x-ratelimit-remaining");
    const ct = resp.headers.get("content-type") || "";

    if (!resp.ok) {
      const raw = await resp.text();
      console.error("Stability error:", raw);
      let err: unknown;
      try {
        err = JSON.parse(raw);
      } catch (error) {
        err = { error: raw };
      }

      return {
        statusCode: resp.status,
        headers: {
          "Content-Type": "application/json",
          ...(remaining ? { "x-ratelimit-remaining": remaining } : {}),
        },
        body: JSON.stringify(err),
      };
    }

    if (ct.startsWith("image/")) {
      const buf = Buffer.from(await resp.arrayBuffer());
      return {
        statusCode: 200,
        headers: {
          "Content-Type": ct,
          "Cache-Control": "no-store",
          ...(remaining ? { "x-ratelimit-remaining": remaining } : {}),
        },
        body: buf.toString("base64"),
        isBase64Encoded: true,
      };
    }

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Unexpected response from Stability" }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "proxy_failure", detail: e?.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
};

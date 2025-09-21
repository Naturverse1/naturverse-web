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

const pngResponse = async (res: Response) => {
  const buf = Buffer.from(await res.arrayBuffer());
  return {
    statusCode: 200,
    isBase64Encoded: true,
    headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
    body: buf.toString("base64"),
  };
};

const errorJson = (statusCode: number, message: string, raw?: unknown) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ errors: [message], raw }),
});

export const handler: Handler = async (event) => {
  try {
    const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
    const STAB_KEY = process.env.STABILITY_API_KEY;

    const { prompt, avoid = "", keepSeed, seed, onBrand = true, stylePreset } =
      JSON.parse(event.body || "{}");

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return errorJson(400, "Missing prompt");
    }

    const finalPrompt = onBrand ? `${prompt.trim()}. ${BRAND_STYLE}` : prompt.trim();
    const negative_prompt = [NEGATIVE, avoid].filter(Boolean).join(", ");

    const effectiveSeed =
      keepSeed && typeof seed === "number" ? seed : undefined;

    if (HF_TOKEN) {
      try {
        const hfRes = await fetch(
          "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${HF_TOKEN}`,
              "Content-Type": "application/json",
              Accept: "image/png",
            },
            body: JSON.stringify({
              inputs: finalPrompt,
              parameters: {
                guidance_scale: 3,
                num_inference_steps: 28,
                negative_prompt,
                width: 1024,
                height: 1024,
                seed: effectiveSeed,
              },
            }),
          }
        );

        if (hfRes.ok && hfRes.headers.get("content-type")?.includes("image")) {
          return pngResponse(hfRes);
        }

        const raw = await hfRes.text();
        console.warn("HF error:", raw);
      } catch (e) {
        console.warn("HF call failed:", e);
      }
    }

    if (STAB_KEY) {
      const bodyPayload: Record<string, unknown> = {
        model: "stable-image-ultra",
        prompt: finalPrompt,
        negative_prompt,
        output_format: "png",
        aspect_ratio: "1:1",
      };
      if (typeof effectiveSeed === "number") bodyPayload.seed = effectiveSeed;
      if (typeof stylePreset === "string") bodyPayload.style_preset = stylePreset;

      const stRes = await fetch(
        "https://api.stability.ai/v2beta/stable-image/generate/core",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${STAB_KEY}`,
            "Content-Type": "application/json",
            Accept: "image/*",
          },
          body: JSON.stringify(bodyPayload),
        }
      );

      if (stRes.ok && stRes.headers.get("content-type")?.includes("image")) {
        return pngResponse(stRes);
      }

      const raw = await stRes.text();
      console.error("Stability error:", raw);
      return errorJson(502, "Stability fallback failed", raw);
    }

    return errorJson(502, "No AI provider available (set HUGGINGFACE_TOKEN or STABILITY_API_KEY).");
  } catch (err: any) {
    console.error(err);
    return errorJson(500, "Server error", String(err));
  }
};

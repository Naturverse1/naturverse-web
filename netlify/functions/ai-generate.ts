import type { Handler } from "@netlify/functions";

/**
 * One function for both providers.
 * - Uses Hugging Face if HUGGINGFACE_API_KEY is set.
 * - Falls back to Stability if not.
 * Returns image/png or JSON error.
 */

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

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const {
      prompt: rawPrompt = "",
      keepSeed = true,
      seed,
      onBrand = true,
      avoid = "",
    } = JSON.parse(event.body || "{}");

    const prompt = String(rawPrompt || "").trim();
    if (!prompt) {
      return json(400, { error: "Missing prompt" });
    }

    const finalPrompt = onBrand ? `${prompt}. ${BRAND_STYLE}` : prompt;
    const negativePrompt = [NEGATIVE, String(avoid || "").trim()]
      .filter(Boolean)
      .join(", ");

    const hfKey = process.env.HUGGINGFACE_API_KEY;
    if (hfKey) {
      // ------- Hugging Face (Text-to-Image) -------
      // A widely available, free-friendly cartoon capable model
      // You can swap the model id later without touching the frontend
      const modelId = "Lykon/dreamshaper-8"; // good at stylized/illustrative
      const body = {
        inputs: finalPrompt,
        parameters: {
          negative_prompt: negativePrompt,
          guidance_scale: 7,
          num_inference_steps: 28,
          width: 1024,
          height: 1024,
          seed: keepSeed && typeof seed === "number" ? seed : undefined,
        },
      };

      const res = await fetch(
        `https://api-inference.huggingface.co/models/${modelId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${hfKey}`,
            "Content-Type": "application/json",
            // Ask for raw image back when supported
            Accept: "image/png,application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        const msg =
          ct.includes("application/json") ? await res.json() : await res.text();
        return json(res.status, { provider: "huggingface", error: msg });
      }

      if (ct.startsWith("image/")) {
        const buf = Buffer.from(await res.arrayBuffer());
        return {
          statusCode: 200,
          headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
          body: buf.toString("base64"),
          isBase64Encoded: true,
        };
      }

      // Some HF models return JSON { "generated_image": "data:image/png;base64,..." }
      const payload: any = await res.json();
      const b64 =
        payload?.generated_image?.split(",")?.pop?.() ||
        payload?.[0]?.generated_image?.split(",")?.pop?.();

      if (b64) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
          body: b64,
          isBase64Encoded: true,
        };
      }

      return json(502, {
        provider: "huggingface",
        error: "Unexpected response format from model",
      });
    }

    // ------- Stability fallback (kept as-is) -------
    const key = process.env.STABILITY_API_KEY;
    if (!key) {
      return json(400, {
        error:
          "No provider configured. Set HUGGINGFACE_API_KEY or STABILITY_API_KEY.",
      });
    }

    const body = {
      model: "stable-image-ultra",
      prompt: finalPrompt,
      negative_prompt: negativePrompt,
      output_format: "png",
      aspect_ratio: "1:1",
      seed: keepSeed && typeof seed === "number" ? seed : undefined,
    };

    const resp = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Accept: "image/*,application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const ct = resp.headers.get("content-type") || "";
    const remaining = resp.headers.get("x-ratelimit-remaining");
    if (!resp.ok) {
      const err =
        ct.includes("application/json")
          ? await resp.json()
          : await resp.text();
      return json(resp.status, { provider: "stability", error: err }, remaining || undefined);
    }

    if (ct.startsWith("image/")) {
      const buf = Buffer.from(await resp.arrayBuffer());
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-store",
          ...(remaining ? { "x-ratelimit-remaining": remaining } : {}),
        },
        body: buf.toString("base64"),
        isBase64Encoded: true,
      };
    }

    return json(502, {
      provider: "stability",
      error: "Unexpected response format from Stability",
    });
  } catch (e: any) {
    return json(500, { error: e?.message || "Server error" });
  }
};

function json(statusCode: number, obj: unknown, remaining?: string) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(remaining ? { "x-ratelimit-remaining": remaining } : {}),
    },
    body: JSON.stringify(obj),
  };
}

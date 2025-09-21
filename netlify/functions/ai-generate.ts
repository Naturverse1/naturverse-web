import type { Handler } from "@netlify/functions";

const HF_MODEL =
  process.env.HF_MODEL || "black-forest-labs/FLUX.1-dev";

// IMPORTANT: prefer the fine-grained token you created: HUGGINGFACE_API_KEY
const HF_TOKEN =
  process.env.HUGGINGFACE_API_KEY || process.env.HF_API_TOKEN || "";

const json = (code: number, obj: unknown) => ({
  statusCode: code,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(obj),
});

export const handler: Handler = async (event) => {
  try {
    if (!HF_TOKEN) {
      return json(500, {
        error: "Missing Hugging Face token",
        hint: "Set HUGGINGFACE_API_KEY (or HF_API_TOKEN) in Netlify env.",
      });
    }

    const body = JSON.parse(event.body || "{}");
    const {
      prompt = "",
      seed,
      onBrand = true,
      avoid = "",
      width = 1024,
      height = 1024,
    } = body;

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

    const finalPrompt = onBrand && prompt
      ? `${prompt}. ${BRAND_STYLE}`
      : prompt;

    const negativeParts = [onBrand ? NEGATIVE : null, avoid].filter(Boolean);
    const negative_prompt = negativeParts.join(", ");

    // HF JSON payload
    const payload: Record<string, unknown> = {
      inputs: finalPrompt,
      parameters: {
        width,
        height,
        seed,
        guidance_scale: 5,
        num_inference_steps: 28,
        negative_prompt,
      },
    };

    const resp = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "image/png,application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const ct = resp.headers.get("content-type") || "";

    if (!resp.ok) {
      const errText = await resp.text();
      return json(resp.status, {
        error: "Hugging Face error",
        detail: errText.slice(0, 1000),
        model: HF_MODEL,
        used_env: process.env.HUGGINGFACE_API_KEY
          ? "HUGGINGFACE_API_KEY"
          : process.env.HF_API_TOKEN
          ? "HF_API_TOKEN"
          : "none",
      });
    }

    if (ct.includes("image/")) {
      const buf = Buffer.from(await resp.arrayBuffer());
      return {
        statusCode: 200,
        isBase64Encoded: true,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-store",
        },
        body: buf.toString("base64"),
      };
    }

    // If HF returned JSON (e.g. queued/loading), pass it through
    const txt = await resp.text();
    return json(200, { note: "non-image response", raw: txt });
  } catch (e: any) {
    return json(500, { error: "ai-generate crashed", detail: String(e?.message || e) });
  }
};

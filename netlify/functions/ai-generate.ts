import type { Handler } from "@netlify/functions";

type JsonResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

const JSON_HEADERS: JsonResponse["headers"] = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

const HF_MODEL =
  process.env.HUGGINGFACE_MODEL ?? "black-forest-labs/FLUX.1-schnell";
const HF_TOKEN =
  process.env.HUGGINGFACE_API_KEY ?? process.env.HF_API_TOKEN ?? "";

function json(statusCode: number, payload: Record<string, unknown>): JsonResponse {
  return {
    statusCode,
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  };
}

export const handler: Handler = async (event) => {
  try {
    if (!HF_TOKEN) {
      return json(500, {
        error: "Missing Hugging Face token",
        hint: "Set HUGGINGFACE_API_KEY (or HF_API_TOKEN) in Netlify env.",
      });
    }

    let body: any = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return json(400, { error: "Invalid JSON payload" });
    }

    const {
      prompt = "",
      seed,
      onBrand = true,
      avoid = "",
      width = 1024,
      height = 1024,
    } = body ?? {};

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

    const finalPrompt = onBrand && prompt ? `${prompt}. ${BRAND_STYLE}` : prompt;
    const negative_prompt = [NEGATIVE, avoid].filter(Boolean).join(", ");

    const payload = {
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
          Accept: "image/png",
        },
        body: JSON.stringify(payload),
      }
    );

    const ct = resp.headers.get("content-type") || "";

    if (ct.includes("application/json")) {
      const detail = await resp
        .json()
        .catch(async () => ({ raw: await resp.text() }));
      return json(resp.ok ? 200 : resp.status, {
        error: resp.ok ? undefined : "Hugging Face error",
        detail,
        model: HF_MODEL,
        used_env: process.env.HUGGINGFACE_API_KEY
          ? "HUGGINGFACE_API_KEY"
          : process.env.HF_API_TOKEN
          ? "HF_API_TOKEN"
          : "none",
      });
    }

    if (!resp.ok) {
      const errText = await resp.text();
      return json(resp.status, {
        error: "Hugging Face error",
        detail: errText.slice(0, 1000),
      });
    }

    const buf = Buffer.from(await resp.arrayBuffer());
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
      body: buf.toString("base64"),
    };
  } catch (e: any) {
    return json(500, {
      error: "ai-generate crashed",
      detail: String(e?.message || e),
    });
  }
};

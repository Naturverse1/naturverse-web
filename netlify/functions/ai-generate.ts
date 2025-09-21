import type { Handler } from "@netlify/functions";

const HF_URL =
  "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";
const STABILITY_URL =
  "https://api.stability.ai/v2beta/stable-image/generate/core";

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
      prompt = "",
      avoid = "",
      keepSeed,
      seed,
      onBrand = true,
    } = JSON.parse(event.body || "{}");

    const finalPrompt = onBrand ? `${prompt}. ${BRAND_STYLE}` : prompt;
    const negative_prompt = [NEGATIVE, avoid].filter(Boolean).join(", ");

    const HF_TOKEN = process.env.HF_TOKEN;
    if (HF_TOKEN) {
      const res = await fetch(HF_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "image/*",
        },
        body: JSON.stringify({
          inputs: finalPrompt,
          parameters: {
            negative_prompt,
            guidance_scale: 3.5,
          },
          options: { wait_for_model: true },
        }),
      });

      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.startsWith("image/")) {
        const buf = Buffer.from(await res.arrayBuffer());
        return {
          statusCode: 200,
          headers: { "Content-Type": ct },
          body: buf.toString("base64"),
          isBase64Encoded: true,
        };
      }

      const msg = await safeErr(res);
      if (!process.env.STABILITY_API_KEY) {
        return jsonErr(502, msg || "HF failed and no fallback is configured");
      }
    }

    const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
    if (!STABILITY_API_KEY) {
      return jsonErr(400, "No AI provider configured");
    }

    const effectiveSeed =
      keepSeed && typeof seed === "number" ? seed : undefined;

    const bodyPayload: Record<string, unknown> = {
      model: "stable-image-ultra",
      prompt: finalPrompt,
      negative_prompt,
      output_format: "png",
      aspect_ratio: "1:1",
    };

    if (typeof effectiveSeed === "number") bodyPayload.seed = effectiveSeed;

    const sres = await fetch(STABILITY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STABILITY_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "image/*, application/json",
      },
      body: JSON.stringify(bodyPayload),
    });

    const sct = sres.headers.get("content-type") || "";
    if (sres.ok && sct.startsWith("image/")) {
      const buf = Buffer.from(await sres.arrayBuffer());
      return {
        statusCode: 200,
        headers: { "Content-Type": sct },
        body: buf.toString("base64"),
        isBase64Encoded: true,
      };
    }

    const smsg = await safeErr(sres);
    return jsonErr(sres.status || 500, smsg || "Stability request failed");
  } catch (e: any) {
    return jsonErr(500, e?.message || "Server error");
  }
};

function jsonErr(code: number, error: string) {
  return {
    statusCode: code,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error }),
  };
}

async function safeErr(res: Response) {
  try {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const j = await res.json();
      return j?.error || j?.message || JSON.stringify(j);
    }
    return await res.text();
  } catch {
    return `HTTP ${res.status}`;
  }
}

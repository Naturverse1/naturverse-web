// Netlify serverless: Hugging Face FLUX.1-dev image generator (JSON only)
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

const HF_MODEL = "black-forest-labs/FLUX.1-dev"; // free-tier friendly
const PNG_MIME = "image/png";

type Req = {
  prompt: string;
  avoid?: string;
  onBrand?: boolean; // default true
  seed?: number; // optional; when absent HF randomizes
};

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const HF_API_TOKEN = process.env.HF_API_TOKEN;
    if (!HF_API_TOKEN) {
      return {
        statusCode: 500,
        body: JSON.stringify({ errors: ["Missing HF_API_TOKEN"] }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const { prompt, avoid = "", onBrand = true, seed }: Req =
      JSON.parse(event.body || "{}");

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ errors: ["Missing prompt"] }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const finalPrompt = onBrand
      ? `${prompt.trim()}. ${BRAND_STYLE}`
      : prompt.trim();

    const negativeParts = [] as string[];
    if (onBrand) {
      negativeParts.push(NEGATIVE);
    }
    if (avoid?.trim()) {
      negativeParts.push(avoid.trim());
    }
    const negative_prompt = negativeParts.join(", ");

    const payload: Record<string, unknown> = {
      prompt: finalPrompt,
      negative_prompt,
      height: 1024,
      width: 1024,
      guidance_scale: 5,
      num_inference_steps: 28,
      ...(typeof seed === "number" ? { seed } : {}),
    };

    const res = await fetch(
      `https://api-inference.huggingface.co/models/${encodeURIComponent(
        HF_MODEL
      )}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
          Accept: PNG_MIME,
        } as Record<string, string>,
        body: JSON.stringify(payload),
      }
    );

    const ct = res.headers.get("content-type") || "";
    if (!res.ok) {
      const raw = await res.text();
      return {
        statusCode: res.status,
        body: JSON.stringify({ errors: ["Hugging Face error"], raw }),
        headers: { "Content-Type": "application/json" },
      };
    }

    if (ct.includes("application/json")) {
      const raw = await res.text();
      return {
        statusCode: 502,
        body: JSON.stringify({ errors: ["HF returned JSON instead of image"], raw }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const arrayBuf = await res.arrayBuffer();
    return {
      statusCode: 200,
      body: Buffer.from(arrayBuf).toString("base64"),
      isBase64Encoded: true,
      headers: { "Content-Type": PNG_MIME },
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ errors: ["Server error"], detail: String(err) }),
      headers: { "Content-Type": "application/json" },
    };
  }
};

export default handler;

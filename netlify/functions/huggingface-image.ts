import type { Handler } from "@netlify/functions";
import { arrayBufferToBase64 } from "./_utils/base64";
import { preflight, withCors } from "./_utils/cors";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return preflight();
  }

  if (event.httpMethod !== "POST") {
    return withCors({ ok: false, error: "Method not allowed" }, 405);
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    return withCors({ ok: false, error: "HUGGINGFACE_API_KEY missing" }, 500);
  }

  let payload: any = {};
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return withCors({ ok: false, error: "Invalid JSON" }, 400);
  }

  const prompt = typeof payload.prompt === "string" ? payload.prompt : "";
  const model = typeof payload.model === "string" && payload.model.trim().length > 0
    ? payload.model
    : "black-forest-labs/FLUX.1-schnell";

  if (!prompt.trim()) {
    return withCors({ ok: false, error: "Missing prompt" }, 400);
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
          accept: "image/png",
        },
        body: JSON.stringify({ inputs: prompt }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      return withCors({ ok: false, error: `HF ${response.status}: ${text}` }, 502);
    }

    const buffer = await response.arrayBuffer();
    if (!buffer || buffer.byteLength === 0) {
      return withCors({ ok: false, error: "HF: empty image buffer" }, 502);
    }

    const base64 = arrayBufferToBase64(buffer);
    return withCors({ ok: true, image_base64: `data:image/png;base64,${base64}` });
  } catch (error: any) {
    return withCors({ ok: false, error: error?.message || "HF handler error" }, 500);
  }
};

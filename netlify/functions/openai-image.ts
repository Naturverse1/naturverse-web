import type { Handler } from "@netlify/functions";
import { preflight, withCors } from "./_utils/cors";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return preflight();
  }

  if (event.httpMethod !== "POST") {
    return withCors({ ok: false, error: "Method not allowed" }, 405);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return withCors({ ok: false, error: "OPENAI_API_KEY missing" }, 500);
  }

  let payload: any = {};
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return withCors({ ok: false, error: "Invalid JSON" }, 400);
  }

  const prompt = typeof payload.prompt === "string" ? payload.prompt : "";
  const size = typeof payload.size === "string" ? payload.size : "512x512";

  if (!prompt.trim()) {
    return withCors({ ok: false, error: "Missing prompt" }, 400);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size,
        response_format: "b64_json",
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return withCors({ ok: false, error: `OpenAI ${response.status}: ${text}` }, 502);
    }

    const data = await response.json();
    const base64 = data?.data?.[0]?.b64_json;

    if (!base64) {
      return withCors({ ok: false, error: "OpenAI: empty image" }, 502);
    }

    return withCors({ ok: true, image_base64: `data:image/png;base64,${base64}` });
  } catch (error: any) {
    return withCors({ ok: false, error: error?.message || "OpenAI handler error" }, 500);
  }
};

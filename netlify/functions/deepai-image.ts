import type { Handler } from "@netlify/functions";
import { preflight, withCors } from "./_utils/cors";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return preflight();
  }

  if (event.httpMethod !== "POST") {
    return withCors({ ok: false, error: "Method not allowed" }, 405);
  }

  const apiKey = process.env.DEEPAI_API_KEY;
  if (!apiKey) {
    return withCors({ ok: false, error: "DEEPAI_API_KEY missing" }, 500);
  }

  let payload: any = {};
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return withCors({ ok: false, error: "Invalid JSON" }, 400);
  }

  const prompt = typeof payload.prompt === "string" ? payload.prompt : "";

  if (!prompt.trim()) {
    return withCors({ ok: false, error: "Missing prompt" }, 400);
  }

  try {
    const form = new FormData();
    form.append("text", prompt);

    const response = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: {
        "api-key": apiKey,
      },
      body: form,
    });

    if (!response.ok) {
      const text = await response.text();
      return withCors({ ok: false, error: `DeepAI ${response.status}: ${text}` }, 502);
    }

    const data = await response.json();
    const url = data?.output_url || (Array.isArray(data?.output) ? data.output[0] : null);

    if (!url) {
      return withCors({ ok: false, error: "DeepAI: empty image url" }, 502);
    }

    return withCors({ ok: true, image_url: url });
  } catch (error: any) {
    return withCors({ ok: false, error: error?.message || "DeepAI handler error" }, 500);
  }
};

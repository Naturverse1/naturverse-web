import type { Handler } from "@netlify/functions";

const API_URL = "https://api.stability.ai/v2beta/stable-image/generate/core";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body ?? "{}");
    if (!prompt || typeof prompt !== "string") {
      return { statusCode: 400, body: "Prompt is required" };
    }

    // Build multipart/form-data body
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("output_format", "png");
    form.append("aspect_ratio", "1:1"); // square avatar
    // Optional: pick a model (commented means default/core)
    // form.append("model", "sd3");

    // IMPORTANT: do NOT set Content-Type header (fetch sets boundary)
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY!}`,
        Accept: "image/png",
      },
      body: form,
    });

    // If Stability returns JSON, it’s an error payload
    const ct = resp.headers.get("content-type") || "";
    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: resp.status, body: text };
    }
    if (ct.includes("application/json")) {
      const err = await resp.text();
      return { statusCode: 500, body: err };
    }

    const buf = Buffer.from(await resp.arrayBuffer());
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: `data:image/png;base64,${buf.toString("base64")}` }),
    };
  } catch (e: any) {
    return { statusCode: 500, body: e?.message ?? "Internal error" };
  }
};

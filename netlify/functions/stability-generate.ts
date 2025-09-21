import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  try {
    const API_KEY = process.env.STABILITY_API_KEY;
    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing STABILITY_API_KEY" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing prompt" }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // Build multipart form-data (let fetch set the Content-Type+boundary)
    const form = new FormData();
    form.append("prompt", prompt);
    form.append("output_format", "png");

    const resp = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          // IMPORTANT: Accept must be image/* or application/json
          Accept: "image/*",
        },
        body: form,
      }
    );

    if (!resp.ok) {
      const errTxt = await resp.text().catch(() => "");
      return {
        statusCode: resp.status,
        body: JSON.stringify({ error: "stability_error", detail: errTxt }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const buf = Buffer.from(await resp.arrayBuffer());
    return {
      statusCode: 200,
      headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
      body: buf.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "proxy_failure", detail: e?.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
};

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

    const body = JSON.parse(event.body || "{}");
    const { prompt, negativePrompt, seed, size } = body ?? {};
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

    if (negativePrompt && typeof negativePrompt === "string") {
      form.append("negative_prompt", negativePrompt);
    }

    if (typeof seed === "number" && Number.isFinite(seed)) {
      const clamped = Math.max(0, Math.min(0xffff_ffff, Math.floor(seed)));
      form.append("seed", String(clamped));
    }

    let width: number | undefined;
    let height: number | undefined;

    if (size && typeof size === "string") {
      const match = size.toLowerCase().split("x");
      if (match.length === 2) {
        const parsedWidth = Number(match[0]);
        const parsedHeight = Number(match[1]);
        if (Number.isFinite(parsedWidth) && Number.isFinite(parsedHeight)) {
          width = Math.max(128, Math.min(2048, Math.floor(parsedWidth)));
          height = Math.max(128, Math.min(2048, Math.floor(parsedHeight)));
        }
      }
    }

    if (!width || !height) {
      width = 1024;
      height = 1024;
    }

    form.append("width", String(width));
    form.append("height", String(height));

    const headers: Record<string, string> = {
      Authorization: `Bearer ${API_KEY}`,
      // IMPORTANT: Accept must be image/* or application/json
      Accept: "image/*",
    };

    const resp = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      {
        method: "POST",
        headers,
        body: form,
      }
    );

    const remaining = resp.headers.get("x-ratelimit-remaining");

    if (!resp.ok) {
      const errTxt = await resp.text().catch(() => "");
      return {
        statusCode: resp.status,
        body: JSON.stringify({ error: "stability_error", detail: errTxt }),
        headers: {
          "Content-Type": "application/json",
          ...(remaining ? { "x-ratelimit-remaining": remaining } : {}),
        },
      };
    }

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
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "proxy_failure", detail: e?.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
};

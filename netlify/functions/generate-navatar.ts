import type { Handler } from "@netlify/functions";

const API_URL = "https://api.stability.ai/v2beta/stable-image/generate/core";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: "Missing STABILITY_API_KEY" };
  }

  let prompt: string | undefined;
  try {
    const payload = JSON.parse(event.body ?? "{}");
    prompt = typeof payload.prompt === "string" ? payload.prompt.trim() : undefined;
  } catch (error) {
    return { statusCode: 400, body: "Invalid JSON payload" };
  }

  if (!prompt) {
    return { statusCode: 400, body: "Prompt is required" };
  }

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "image/png",
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        prompt,
        output_format: "png",
        width: 512,
        height: 512,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { statusCode: response.status, body: errorText || "Failed to generate image" };
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: `data:image/png;base64,${base64}`,
      }),
    };
  } catch (error: any) {
    const message = error?.message ?? "Internal error";
    return { statusCode: 500, body: message };
  }
};

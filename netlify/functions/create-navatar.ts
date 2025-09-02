import type { Handler } from "@netlify/functions";
import OpenAI from "openai";

const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { name = "Navatar", prompt = "" } = JSON.parse(event.body || "{}");

    if (!process.env.OPENAI_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "Missing OPENAI_API_KEY" }) };
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      return { statusCode: 502, body: JSON.stringify({ error: "No image data returned" }) };
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        mime: "image/png",
        b64,
      }),
    };
  } catch (err: any) {
    const code = Number(err?.status) || 500;
    return {
      statusCode: code,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        error: err?.message || "Failed to generate",
      }),
    };
  }
};

export { handler };

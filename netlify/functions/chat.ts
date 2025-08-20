import type { Handler } from "@netlify/functions";
import OpenAI from "openai";

// Simple CORS helper
const cors = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  }
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: cors.headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors.headers, body: "Method Not Allowed" };
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers: cors.headers, body: "Missing OPENAI_API_KEY" };
    }

    const { messages } = JSON.parse(event.body || "{}") as {
      messages: { role: "system" | "user" | "assistant"; content: string }[];
    };

    if (!messages || !Array.isArray(messages)) {
      return { statusCode: 400, headers: cors.headers, body: "Invalid payload" };
    }

    const client = new OpenAI({ apiKey });

    // Non-streaming completion to keep it simple/robust for Netlify Functions
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...cors.headers },
      body: JSON.stringify({ reply: completion.choices?.[0]?.message?.content ?? "" })
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: cors.headers,
      body: `Function error: ${err?.message || "unknown"}`
    };
  }
};

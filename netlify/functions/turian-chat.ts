import type { Handler } from "@netlify/functions";

const MODEL = "llama-3.1-8b-instant";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: "Missing GROQ_API_KEY" };
  }

  try {
    const { messages } = JSON.parse(event.body || "{}") as {
      messages: { role: "system" | "user" | "assistant"; content: string }[];
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return { statusCode: 400, body: "messages required" };
    }

    const last = messages[messages.length - 1]?.content || "";
    if (last.length > 4000) {
      return { statusCode: 413, body: "Message too long" };
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        max_tokens: 400,
        messages,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return { statusCode: 502, body: text || "Groq error" };
    }

    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content ?? "…";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return { statusCode: 500, body: message };
  }
};

import type { Handler } from "@netlify/functions";

const fallback = {
  tips: [
    "Try a 60-second nature breath.",
    "Spot three leaf shapes today.",
    "Ask a 'why' about any animal!",
    "Draw your tiny world."
  ]
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!process.env.OPENAI_API_KEY) {
    return { statusCode: 200, body: JSON.stringify(fallback) };
  }

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are Turian the Durian, a playful, kid-safe guide for a nature-learning app. Reply with 3–5 short, friendly tips (max ~16 words each). Keep G-rated, curious, encouraging. JSON only: { \"tips\": [\"...\"] }.",
          },
          {
            role: "user",
            content: "Make tips about exploration, kind learning, and quick activities.",
          },
        ],
        temperature: 0.6,
        max_tokens: 200,
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      return { statusCode: 200, body: JSON.stringify(fallback) };
    }

    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(text || "{}");
    const tips = Array.isArray(parsed.tips) ? parsed.tips : [];
    if (!tips.length) {
      return { statusCode: 200, body: JSON.stringify(fallback) };
    }
    return { statusCode: 200, body: JSON.stringify({ tips }) };
  } catch {
    return { statusCode: 200, body: JSON.stringify(fallback) };
  }
};


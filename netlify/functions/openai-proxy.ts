import type { Handler } from "@netlify/functions";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_BEARER;

export const handler: Handler = async (event) => {
  if (!OPENAI_API_KEY) return { statusCode: 500, body: "Missing OPENAI_API_KEY" };
  try {
    const { prompt, system } = JSON.parse(event.body || "{}");
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          ...(system ? [{ role: "system", content: system }] : []),
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      return { statusCode: 500, body: t };
    }
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    return { statusCode: 200, body: JSON.stringify({ text }) };
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || "error" };
  }
};

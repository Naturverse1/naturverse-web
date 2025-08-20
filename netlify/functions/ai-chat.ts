import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { statusCode: 200, body: JSON.stringify({ content: "AI temporarily offline." }) };

  const { prompt } = JSON.parse(event.body || "{}");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Naturverse Tutor. Be concise, kid-friendly, and curious." },
        { role: "user", content: prompt || "Say hi!" }
      ],
      temperature: 0.7
    })
  });
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content ?? "…";
  return { statusCode: 200, body: JSON.stringify({ content }) };
};

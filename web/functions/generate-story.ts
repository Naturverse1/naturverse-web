import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }
    const { topic, age = 8, tone = "curious", length = 450 } = JSON.parse(event.body || "{}" );

    if (!process.env.OPENAI_API_KEY) {
      return { statusCode: 500, body: "Missing OPENAI_API_KEY" };
    }

    // Simple safety and guardrails
    const system = `You are a kids' nature storyteller. \
Keep content G-rated, friendly, and factual. \
No scary or violent content. Vocabulary appropriate for ages ${age}. \
Write in ${tone} tone. Keep it around ${length} words. \
End with a positive reflection question.`;

    const user = `Write a short story about: ${topic}.\nInclude 3 short sections with headings.\nTitle it.`;

    // Call OpenAI Chat Completions (Responses API compatible prompt)
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.8,
        max_tokens: 1200,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return { statusCode: 500, body: `OpenAI error: ${errText}` };
    }

    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "No story generated.";
    return { statusCode: 200, body: JSON.stringify({ story: text }) };
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || "Server error" };
  }
};

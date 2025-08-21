// Serverless chat function powered by OpenAI Responses API (no npm dep)
type NetlifyEvent = { httpMethod: string; body?: string | null };

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors };
  }

  if (!process.env.OPENAI_API_KEY) {
    return { statusCode: 500, headers: cors, body: "Missing OPENAI_API_KEY" };
  }

  const { prompt, system } = event.body ? JSON.parse(event.body) : {};

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: system ?? "You are Turian, a friendly guide for kids. Keep replies short, helpful, and fun." },
        { role: "user", content: prompt ?? "Say hi." },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    return { statusCode: 502, headers: cors, body: `OpenAI error: ${err}` };
  }

  const data = await res.json();
  const text = (data && (data.output_text ?? "")) as string;

  return {
    statusCode: 200,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  };
}

import type { Handler } from "@netlify/functions";

const MODEL = "llama-3-70b-8192";

const PURPOSE_SYSTEM: Record<string, string> = {
  navatar: "You generate playful, kid-safe Navatar character sheets as strict JSON.",
  card: "You write concise, upbeat character card copy and backstories as strict JSON.",
  lesson: "You design short age-appropriate lessons and 5-question quizzes as strict JSON.",
};

export const handler: Handler = async event => {
  if (!process.env.GROQ_API_KEY) {
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: false, error: "Missing GROQ_API_KEY" }),
    };
  }

  try {
    const { purpose, input } = JSON.parse(event.body || "{}");

    const system = PURPOSE_SYSTEM[purpose as keyof typeof PURPOSE_SYSTEM] ?? "Be concise and return strict JSON.";

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `${system} Always keep it child-friendly, cheerful, and JSON only.` },
          { role: "user", content: JSON.stringify(input ?? {}) },
        ],
      }),
    });

    if (!response.ok) {
      return { statusCode: response.status, body: await response.text() };
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      throw new Error("Missing AI response");
    }

    const json = JSON.parse(content);

    return { statusCode: 200, body: JSON.stringify({ ok: true, data: json }) };
  } catch (error: any) {
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: false, error: typeof error?.message === "string" ? error.message : String(error) }),
    };
  }
};

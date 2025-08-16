import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }
    const { passage, objective = "Check reading comprehension for ages 8-10." } = JSON.parse(event.body || "{}" );

    if (!process.env.OPENAI_API_KEY) {
      return { statusCode: 500, body: "Missing OPENAI_API_KEY" };
    }

    const system = `You create kid-safe multiple-choice quizzes (3–5 questions).\nEach question:\n- has 1 correct answer and 3 distractors\n- is short and clear\nReturn strict JSON:\n{\n  "questions": [\n    {\n      "q": "string",\n      "choices": ["A","B","C","D"],\n      "answerIndex": 0,\n      "why": "one-sentence rationale"\n    }\n  ]\n}`;

    const user = `Make a quiz for this passage and objective.\nObjective: ${objective}\nPassage: """${passage}"""`;

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
        temperature: 0.4,
        response_format: { type: "json_object" },
        max_tokens: 900,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return { statusCode: 500, body: `OpenAI error: ${errText}` };
    }

    const data = await resp.json();
    const json = JSON.parse(data.choices?.[0]?.message?.content || `{"questions":[]}`);
    return { statusCode: 200, body: JSON.stringify(json) };
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || "Server error" };
  }
};

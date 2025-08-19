import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side only
);

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { topic = "eco-friendly living" } = JSON.parse(event.body || "{}");

    // --- OpenAI call (text generation) ---
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You write short, practical eco & wellness tips (max 60 words).",
          },
          {
            role: "user",
            content: `Give me one concise tip about: ${topic}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      return { statusCode: 500, body: `OpenAI error: ${text}` };
    }

    const data = await r.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return { statusCode: 500, body: "No content from OpenAI." };
    }

    // --- Save in Supabase (table: tips) ---
    const { error, data: inserted } = await supabase
      .from("tips")
      .insert([{ content, topic }])
      .select()
      .single();

    if (error) {
      return { statusCode: 500, body: `Supabase insert error: ${error.message}` };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inserted),
    };
  } catch (e: any) {
    return { statusCode: 500, body: `Unexpected error: ${e?.message}` };
  }
};

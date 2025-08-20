// @ts-ignore - Netlify provides types at build
import type { Handler } from "@netlify/functions";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const handler: Handler = async (event) => {
  try {
    if (!process.env.OPENAI_API_KEY) return resp(500, "OPENAI_API_KEY missing");
    const body = event.body ? JSON.parse(event.body) : {};
    const msgs = body?.messages ?? [{ role: "user", content: "Hello" }];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: msgs,
      temperature: 0.7,
    });

    const reply = completion.choices?.[0]?.message?.content ?? "";
    return resp(200, { reply });
  } catch (e: any) {
    return resp(500, e.message ?? "error");
  }
};

function resp(statusCode: number, body: any) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}


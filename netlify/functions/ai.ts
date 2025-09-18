/* Netlify function: AI utilities for lesson, quiz, card */
import type { Handler } from '@netlify/functions';
import { z } from 'zod';

const BodySchema = z.object({
  action: z.enum(['lesson', 'quiz', 'card']),
  prompt: z.string().min(1)
});

type Body = z.infer<typeof BodySchema>;

const HEADERS = { 'Content-Type': 'application/json' };

// Current models: https://console.groq.com/docs/models
const MODEL = process.env.GROQ_MODEL ?? 'llama-3.1-8b-instant';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = process.env.GROQ_API_KEY!;

const SYSTEM: Record<Body['action'], string> = {
  lesson:
`You are Turian. Create a short kid-friendly mini-lesson.
Return ONLY JSON:
{"title":"...", "intro":"...", "outline":["...","..."], "activities":["1) ...","2) ..."]}`,
  quiz:
`You are Turian. Create a short 3-question multiple-choice quiz (A–D) for kids.
Return ONLY JSON:
{"questions":[{"q":"...", "options":["A","B","C","D"], "answer":"A"}]}`,
  card:
`You are Turian. Turn a child’s character description into fields.
Return ONLY JSON:
{"name":"...", "species":"...", "kingdom":"...", "backstory":"...", "powers":["..."], "traits":["..."]}`
};

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers: HEADERS });
  }

  let parsed: Body;
  try {
    const json = event.body ? JSON.parse(event.body) : {};
    const result = BodySchema.safeParse(json);
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'bad request', details: result.error.flatten() }), {
        status: 400,
        headers: HEADERS
      });
    }
    parsed = result.data;
  } catch {
    return new Response(JSON.stringify({ error:'bad json' }), { status: 400, headers: HEADERS });
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM[parsed.action] },
        { role: 'user', content: parsed.prompt }
      ],
      temperature: 0.4,
      max_tokens: 900
    })
  });

  if (!res.ok) {
    const text = await res.text(); // forward Groq’s real message (fixes opaque “400”)
    return new Response(JSON.stringify({ error: text }), { status: res.status, headers: HEADERS });
  }

  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content || '{}';

  // be forgiving on JSON
  let out: unknown = {};
  try { out = JSON.parse(content); }
  catch { /* ignore; return empty object */ }

  return new Response(JSON.stringify(out), { status: 200, headers: HEADERS });
};

export { handler };

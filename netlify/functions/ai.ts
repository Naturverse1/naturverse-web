import type { Handler } from '@netlify/functions';
import { z } from 'zod';

const GROQ_KEY = process.env.GROQ_API_KEY!;
const MODEL = process.env.GROQ_MODEL ?? 'llama-3.1-8b-instant';

const H = { 'content-type': 'application/json' as const };

const QuizSchema = z.object({
  questions: z.array(z.object({
    q: z.string(),
    options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
    answer: z.enum(['A','B','C','D'])
  })).min(1)
});

const LessonSchema = z.object({
  title: z.string(),
  age: z.number(),
  intro: z.string(),
  outline: z.array(z.string()).min(1),
  activities: z.array(z.string()).min(1)
});

const CardSchema = z.object({
  name: z.string(),
  species: z.string(),
  kingdom: z.string(),
  backstory: z.string(),
  powers: z.array(z.string()).default([]),
  traits: z.array(z.string()).default([])
});

type Body = {
  action: 'quiz' | 'lesson' | 'card';
  prompt: string;   // user topic/description/notes
  age?: number;     // used by quiz/lesson
};

const systemByAction: Record<Body['action'], string> = {
  quiz:
    `You are Turian. Create a short 3-question multiple-choice quiz (A–D) for kids.
Return ONLY JSON with keys: questions:[{q, options:[A,B,C,D], answer}]. No prose.`,
  lesson:
    `You are Turian. Make a tiny lesson plan for kids.
Return ONLY JSON: {title, age, intro, outline[], activities[]}. No prose.`,
  card:
    `You are Turian. Turn the description into a friendly character card.
Return ONLY JSON: {name, species, kingdom, backstory, powers[], traits[]}. No prose.`
};

const schemaByAction = {
  quiz: QuizSchema,
  lesson: LessonSchema,
  card: CardSchema
} as const;

const bad = (status: number, message: string, detail?: unknown) =>
  new Response(JSON.stringify({ error: message, detail }), { status, headers: H });

export const handler: Handler = async (ev) => {
  if (ev.httpMethod !== 'POST') return bad(405, 'Method not allowed');

  let body: Body;
  try {
    body = JSON.parse(ev.body || '{}');
  } catch {
    return bad(400, 'Invalid JSON body');
  }
  const { action, prompt, age } = body;
  if (!action || !prompt) return bad(400, 'Missing action or prompt');

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        max_tokens: 800,
        messages: [
          { role: 'system', content: systemByAction[action] },
          { role: 'user', content: `${prompt}${action !== 'card' && age ? `\nAge: ${age}` : ''}` }
        ]
      })
    });

    // Surface Groq error details instead of a generic 400
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return bad(res.status, 'Groq request failed', text || undefined);
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ?? '';
    if (!text) return bad(502, 'Empty response from model');

    // Try to extract JSON from content (handles accidental prose)
    const jsonStr = (() => {
      // if content is pure JSON
      if (text.trim().startsWith('{') || text.trim().startsWith('[')) return text;
      // fenced code block
      const m = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
      return m ? m[1] : text;
    })();

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      return bad(502, 'Model returned non-JSON content', { content: text });
    }

    // Validate & coerce
    const schema = schemaByAction[action as keyof typeof schemaByAction];
    const cleaned = schema.parse(parsed);

    // Cache-friendly success
    return new Response(JSON.stringify({ ok: true, data: cleaned }), { status: 200, headers: H });
  } catch (err) {
    return bad(500, 'Server error', String(err));
  }
};
export default handler;

import type { Handler } from '@netlify/functions';
import { z } from 'zod';

const HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

const OPTIONS_HEADERS = {
  ...HEADERS,
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};

const BodySchema = z.object({
  action: z.enum(['lesson', 'quiz', 'card', 'backstory']),
  prompt: z.string().trim().min(1, 'prompt is required'),
  age: z.number().finite().optional(),
});

type Body = z.infer<typeof BodySchema>;

const MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
const API_KEY = process.env.GROQ_API_KEY;

const systemByAction: Record<Body['action'], string> = {
  lesson:
    'You are Turian. Write a short kid-friendly mini-lesson (title, intro, 3-bullet outline, 2 activities). Return ONLY JSON: {title, intro, outline:[...], activities:[...]}.',
  quiz: 'Create 3 kid-friendly multiple-choice questions (A–D) about the given topic. Return ONLY JSON: {questions:[{q, options:["A","B","C","D"], answer:"A"}]}.',
  card: 'From this short description, suggest {name, species, kingdom, backstory}. Return ONLY JSON with those keys.',
  backstory:
    'Write a 2–3 sentence playful backstory for a kids character. Return ONLY JSON: {backstory}.',
};

const json = (status: number, payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: HEADERS,
  });

const ok = (data: unknown) => json(200, { ok: true, data });

const errorResponse = (
  status: number,
  code: string,
  message: string,
  extra?: Record<string, unknown>,
) =>
  json(status, {
    ok: false,
    error: {
      code,
      message,
      ...(extra ?? {}),
    },
  });

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return new Response('', {
        status: 200,
        headers: OPTIONS_HEADERS,
      });
    }

    if (event.httpMethod !== 'POST') {
      return errorResponse(405, 'method_not_allowed', 'Method not allowed');
    }

    if (!API_KEY) {
      return errorResponse(500, 'config_missing', 'Missing GROQ_API_KEY');
    }

    if (!event.body) {
      return errorResponse(400, 'bad_request', 'Missing body');
    }

    let raw: unknown;
    try {
      raw = JSON.parse(event.body);
    } catch {
      return errorResponse(400, 'bad_json', 'Body is not valid JSON');
    }

    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return errorResponse(400, 'invalid_request', 'Invalid request body', {
        details: parsed.error.flatten(),
      });
    }

    const body = parsed.data;
    const systemPrompt = systemByAction[body.action];

    if (!systemPrompt) {
      return errorResponse(400, 'unsupported_action', 'Unsupported action');
    }

    const userContent =
      typeof body.age === 'number' ? `${body.prompt}\nAge: ${Math.round(body.age)}` : body.prompt;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        temperature: 0.7,
      }),
    });

    const text = await groqRes.text();
    if (!groqRes.ok) {
      return errorResponse(groqRes.status || 502, 'upstream_error', 'Groq error', {
        detail: text,
      });
    }

    let completion: any;
    try {
      completion = JSON.parse(text);
    } catch {
      return errorResponse(502, 'invalid_upstream', 'Invalid response from Groq', {
        detail: text,
      });
    }

    const content = completion?.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return errorResponse(502, 'no_content', 'No content from model');
    }

    const jsonText = content.replace(/^```json\s*|\s*```$/g, '');
    try {
      const data = JSON.parse(jsonText);
      return ok(data);
    } catch {
      return errorResponse(502, 'non_json_content', 'Non-JSON content from model', {
        detail: content,
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    let detail: string | undefined;

    try {
      const response = (err as any)?.response;
      if (response?.text) {
        detail = await response.text();
      }
    } catch {
      // ignore
    }

    return errorResponse(500, 'internal', message, detail ? { detail } : undefined);
  }
};

export default handler;

import type { Handler } from '@netlify/functions';
import { z } from 'zod';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

const OPTIONS_HEADERS = {
  ...JSON_HEADERS,
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
};

const MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
const API_KEY = process.env.GROQ_API_KEY;

const systemByAction = {
  lesson:
    'You are Turian. Write a short kid-friendly mini-lesson (title, intro, 3-bullet outline, 2 activities). Return ONLY JSON: {title, intro, outline:[...], activities:[...]}.',
  quiz:
    'Create 3 kid-friendly multiple-choice questions (A–D) about the given topic. Return ONLY JSON: {questions:[{q, options:["A","B","C","D"], answer:"A"}]}.',
  card:
    'From this short description, suggest {name, species, kingdom, backstory}. Return ONLY JSON with those keys.',
  backstory:
    'Write a 2–3 sentence playful backstory for a kids character. Return ONLY JSON: {backstory}.',
} as const;

const payloadSchema = z.object({
  action: z
    .enum([
      'lesson',
      'quiz',
      'card',
      'backstory',
      'buildLesson',
      'suggestBackstory',
      'generateCard',
    ])
    .optional(),
  prompt: z.string().trim().min(1, 'prompt required').optional(),
  topic: z.string().optional(),
  age: z.union([z.number(), z.string()]).optional(),
});

type Payload = z.infer<typeof payloadSchema>;
type NormalizedAction = keyof typeof systemByAction;

const ACTION_MAP: Record<NonNullable<Payload['action']>, NormalizedAction> = {
  lesson: 'lesson',
  quiz: 'quiz',
  card: 'card',
  backstory: 'backstory',
  buildLesson: 'lesson',
  suggestBackstory: 'backstory',
  generateCard: 'card',
};

class HttpError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type ApiResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

function json(statusCode: number, payload: Record<string, unknown>): ApiResponse {
  return {
    statusCode,
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  };
}

function parseAge(age: Payload['age']): number | null {
  if (typeof age === 'number' && Number.isFinite(age)) {
    return age;
  }

  if (typeof age === 'string') {
    const numeric = Number(age);
    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  return null;
}

async function callGroq(action: NormalizedAction, prompt: string, age: number | null) {
  const systemPrompt = systemByAction[action];
  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    throw new HttpError(400, 'PROMPT_REQUIRED', 'Prompt is required');
  }

  const userContent =
    age !== null && action === 'lesson'
      ? `${trimmedPrompt}\nAge: ${Math.round(age)}`
      : trimmedPrompt;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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

  const text = await response.text();
  if (!response.ok) {
    throw new HttpError(response.status, 'UPSTREAM', 'Groq error', text);
  }

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new HttpError(502, 'INVALID_UPSTREAM_RESPONSE', 'Invalid response from Groq');
  }

  const content = parsed?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new HttpError(502, 'EMPTY_UPSTREAM_RESPONSE', 'No content from model');
  }

  const jsonText = content.replace(/^```json\s*|\s*```$/g, '');
  try {
    return JSON.parse(jsonText);
  } catch {
    throw new HttpError(502, 'NON_JSON_CONTENT', 'Non-JSON content from model', content);
  }
}

function normalizeErrorPayload(error: unknown) {
  if (error instanceof HttpError) {
    return json(error.status, {
      ok: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details ?? null,
      },
    });
  }

  if (error instanceof z.ZodError) {
    return json(400, {
      ok: false,
      error: {
        code: 'INVALID_BODY',
        message: 'Invalid request body',
        details: error.flatten(),
      },
    });
  }

  const status = typeof (error as any)?.statusCode === 'number' ? (error as any).statusCode : 500;
  const message = (error as any)?.message || 'Unexpected error';
  const details = (error as any)?.response || null;

  return json(status, {
    ok: false,
    error: {
      code: 'UNEXPECTED',
      message,
      details,
    },
  });
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: OPTIONS_HEADERS,
        body: JSON.stringify({ ok: true }),
      };
    }

    if (event.httpMethod !== 'POST') {
      return json(405, {
        ok: false,
        error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' },
      });
    }

    if (!API_KEY) {
      return json(500, {
        ok: false,
        error: { code: 'CONFIG', message: 'Missing GROQ_API_KEY' },
      });
    }

    const rawBody = event.body ?? '{}';
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawBody);
    } catch {
      throw new HttpError(400, 'INVALID_JSON', 'Invalid JSON body');
    }

    const parsed = payloadSchema.parse(parsedJson);
    const { action, prompt, topic, age } = parsed;
    const normalized = action ? ACTION_MAP[action] : null;

    if (!normalized) {
      throw new HttpError(400, 'UNSUPPORTED_ACTION', 'Unsupported action');
    }

    const basePrompt =
      normalized === 'lesson'
        ? (prompt ?? topic ?? '')
        : (prompt ?? '');

    const result = await callGroq(normalized, basePrompt, parseAge(age));
    return json(200, { ok: true, data: result });
  } catch (error) {
    return normalizeErrorPayload(error);
  }
};

export default handler;

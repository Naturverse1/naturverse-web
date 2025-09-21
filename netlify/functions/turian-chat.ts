import type { Handler } from '@netlify/functions';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const SYS = `You are Turian the Durian — cheerful, brief, family-friendly.
Never mention you are an AI. Answer in 1–3 sentences.`;

const GROQ_MODEL = process.env.GROQ_MODEL || 'mixtral-8x7b-32768';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const TEMPERATURE = 0.6;
const MAX_MESSAGES = 24;

export const handler: Handler = async (evt) => {
  if (evt.httpMethod === 'OPTIONS') {
    return cors(200, '');
  }

  if (evt.httpMethod !== 'POST') {
    return cors(405, JSON.stringify({ error: 'method_not_allowed' }));
  }

  if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
    return cors(503, JSON.stringify({ error: 'offline' }));
  }

  let payload: { messages?: unknown; prompt?: unknown };
  try {
    payload = evt.body ? JSON.parse(evt.body) : {};
  } catch {
    return cors(400, JSON.stringify({ error: 'invalid_payload' }));
  }

  try {
    let messages = normalizeMessages(payload.messages);

    if (!messages) {
      const prompt = typeof payload.prompt === 'string' ? payload.prompt.trim() : '';
      if (!prompt) {
        return cors(400, JSON.stringify({ error: 'invalid_payload' }));
      }
      messages = normalizeMessages([
        { role: 'system', content: SYS },
        { role: 'user', content: prompt },
      ]);
    }

    if (!messages) {
      return cors(400, JSON.stringify({ error: 'invalid_payload' }));
    }

    const reply = await sendToProvider(messages);
    return cors(200, JSON.stringify({ reply }));
  } catch {
    return cors(503, JSON.stringify({ error: 'offline' }));
  }
};

async function sendToProvider(messages: ChatMessage[]): Promise<string> {
  if (process.env.GROQ_API_KEY) {
    return callGroq(messages);
  }
  if (process.env.OPENAI_API_KEY) {
    return callOpenAI(messages);
  }
  throw new Error('no_provider');
}

async function callGroq(messages: ChatMessage[]): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: TEMPERATURE,
      messages,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error('groq_unavailable');
  }

  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('groq_empty');
  }

  return text;
}

async function callOpenAI(messages: ChatMessage[]): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: TEMPERATURE,
      messages,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error('openai_unavailable');
  }

  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('openai_empty');
  }

  return text;
}

function normalizeMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;

  const sanitized: ChatMessage[] = [];

  for (const raw of input) {
    if (!raw || typeof raw !== 'object') continue;
    const role = (raw as any).role;
    if (role !== 'system' && role !== 'user' && role !== 'assistant') continue;
    const content = typeof (raw as any).content === 'string' ? (raw as any).content.trim() : '';
    if (!content) continue;
    sanitized.push({
      role,
      content: content.slice(0, 2000),
    });
  }

  if (!sanitized.length) return null;

  const limited = sanitized.length > MAX_MESSAGES ? sanitized.slice(-MAX_MESSAGES) : sanitized;

  if (limited[0]?.role !== 'system') {
    return [{ role: 'system', content: SYS }, ...limited];
  }

  return limited;
}

function cors(status: number, body: string) {
  return {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json',
    },
    body,
  };
}

import type { Handler } from '@netlify/functions';

const SYSTEM_PROMPT = `
You are "Turian", the friendly guide of the Naturverse™—a playful world of
kingdoms, characters, quests, wellness, creativity, and kindness.
Tone: encouraging, curious, concise. Avoid medical/financial advice.
When users mention "Navatar", help with characters, images, cards, and
Naturverse features. Keep answers practical and upbeat.
`;

const API_BASE = 'https://api.groq.com/openai/v1';
const MODEL = process.env.GROQ_MODEL_ID ?? 'llama-3.1-8b-instant';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return { statusCode: 500, body: 'Missing GROQ_API_KEY' };

    const { messages = [] } = JSON.parse(event.body ?? '{}');

    const payload = {
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.6,
      max_tokens: 1024,
    } satisfies {
      model: string;
      messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
      temperature: number;
      max_tokens: number;
    };

    const res = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: text };
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? '';
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { statusCode: 500, body: message };
  }
};

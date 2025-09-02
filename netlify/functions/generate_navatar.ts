import type { Handler } from '@netlify/functions';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export const handler: Handler = async (event) => {
  try {
    if (!OPENAI_API_KEY) {
      return { statusCode: 503, body: JSON.stringify({ error: 'OPENAI_API_KEY missing' }) };
    }
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'prompt required' }) };
    }

    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        size: '1024x1024',
        n: 1,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: text }) };
    }

    const json = await res.json();
    const b64 = json?.data?.[0]?.b64_json;
    return { statusCode: 200, body: JSON.stringify({ b64 }) };
  } catch (e: any) {
    return { statusCode: 500, body: JSON.stringify({ error: e?.message || 'server_error' }) };
  }
};

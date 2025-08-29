import type { Handler } from '@netlify/functions';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export const handler: Handler = async (event) => {
  try {
    const { prompt, n = 4, size = '512x512' } = JSON.parse(event.body || '{}');
    if (!prompt || typeof prompt !== 'string') {
      return { statusCode: 400, body: 'Missing prompt' };
    }

    if (prompt.length > 400) {
      return { statusCode: 400, body: 'Prompt too long (max 400 chars)' };
    }

    const composed = `Thailandia Flat style, cute mascot avatar, clean shapes, no text, white/soft background, 1:1. ${prompt}`;

    const r = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: composed,
        size,
        n,
        response_format: 'b64_json',
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      return { statusCode: 500, body: t };
    }

    const json = await r.json();
    const images = (json?.data || []).map((d: any) => d.b64_json);
    return { statusCode: 200, body: JSON.stringify({ images }) };
  } catch (e: any) {
    return { statusCode: 500, body: JSON.stringify({ error: e?.message || 'Server error' }) };
  }
};

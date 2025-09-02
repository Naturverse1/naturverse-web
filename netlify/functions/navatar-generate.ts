import type { Handler } from '@netlify/functions';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    if (!OPENAI_API_KEY) {
      return { statusCode: 500, body: 'Missing OPENAI_API_KEY' };
    }
    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt || typeof prompt !== 'string') {
      return { statusCode: 400, body: 'Missing prompt' };
    }

    const resp = await fetch('https://api.openai.com/v1/images', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        size: '1024x1024',
        response_format: 'b64_json',
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return { statusCode: resp.status, body: txt };
    }

    const data = await resp.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) return { statusCode: 502, body: 'No image returned' };

    return {
      statusCode: 200,
      body: JSON.stringify({ base64: b64, mime: 'image/png' }),
    };
  } catch (e:any) {
    return { statusCode: 500, body: e.message || 'Server error' };
  }
};

export default handler;


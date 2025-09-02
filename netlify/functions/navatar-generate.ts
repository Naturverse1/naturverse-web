import type { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }
  try {
    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt || typeof prompt !== 'string') {
      return { statusCode: 400, body: 'Missing prompt' };
    }

    // Simple, single best image
    const img = await client.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
      n: 1,
    });

    const b64 = img.data?.[0]?.b64_json;
    if (!b64) return { statusCode: 500, body: 'No image returned' };

    return {
      statusCode: 200,
      body: JSON.stringify({ base64: b64, mime: 'image/png' }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (err: any) {
    return { statusCode: 500, body: err?.message || 'Generation error' };
  }
};

export default handler;

import type { Handler } from '@netlify/functions';
import OpenAI from 'openai';

const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'Method Not Allowed' });
    }
    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt || typeof prompt !== 'string') {
      return json(400, { error: 'Missing prompt' });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const img = await client.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    const b64 = img.data?.[0]?.b64_json;
    if (!b64) return json(502, { error: 'No image returned' });

    return json(200, { ok: true, b64 });
  } catch (err: any) {
    // Always send JSON
    return json(500, { error: err?.message || 'Internal error' });
  }
};

function json(status: number, body: unknown) {
  return {
    statusCode: status,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };
}
export { handler };

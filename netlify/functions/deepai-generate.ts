import type { Handler } from '@netlify/functions';

const DEEPAI_URL = 'https://api.deepai.org/api/text2img';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt, width = 1024, height = 1024 } = JSON.parse(event.body || '{}');

    if (!process.env.DEEPAI_API_KEY) {
      return { statusCode: 503, body: 'DeepAI disabled (missing key)' };
    }

    if (!prompt || typeof prompt !== 'string') {
      return { statusCode: 400, body: 'Missing prompt' };
    }

    const res = await fetch(DEEPAI_URL, {
      method: 'POST',
      headers: {
        'api-key': process.env.DEEPAI_API_KEY!,
      },
      body: new URLSearchParams({
        text: prompt,
        width: String(width),
        height: String(height),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: text };
    }

    const json = (await res.json()) as { output_url?: string };
    if (!json.output_url) {
      return { statusCode: 502, body: 'DeepAI did not return an output_url' };
    }

    const imgRes = await fetch(json.output_url);
    if (!imgRes.ok) {
      return { statusCode: 502, body: 'Could not fetch DeepAI image' };
    }

    const arrayBuf = await imgRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuf).toString('base64');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentType: imgRes.headers.get('content-type') || 'image/png',
        data: base64,
      }),
    };
  } catch (err: any) {
    return { statusCode: 500, body: String(err?.message || err) };
  }
};

export default handler;

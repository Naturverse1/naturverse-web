import type { Handler } from '@netlify/functions';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const OPENAI_PROJECT = process.env.OPENAI_PROJECT || '';

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'Method not allowed' });
    }
    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return json(400, { error: 'Missing prompt' });
    }
    if (!OPENAI_API_KEY) {
      return json(500, { error: 'Missing OPENAI_API_KEY' });
    }

    const resp = await fetch('https://api.openai.com/v1/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        ...(OPENAI_PROJECT ? { 'OpenAI-Project': OPENAI_PROJECT } : {})
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        size: '1024x1024',
        response_format: 'b64_json'
      })
    });

    // Always return valid JSON to the client
    const text = await resp.text();
    let data: any = null;
    try { data = JSON.parse(text); } catch {
      return json(resp.status, { error: `Upstream returned non-JSON`, body: text });
    }

    if (!resp.ok) {
      // OpenAI returns structured error
      return json(resp.status, { error: data?.error?.message || 'Generation failed' });
    }

    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) return json(502, { error: 'No image returned' });

    return json(200, { imageBase64: b64, format: 'png' });
  } catch (err: any) {
    return json(500, { error: err?.message || 'Unexpected server error' });
  }
};

function json(status: number, body: any) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}


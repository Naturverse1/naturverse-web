import type { Handler } from '@netlify/functions';

const DEEPAI_URL = 'https://api.deepai.org/api/text2img';

async function deepai(prompt: string) {
  const res = await fetch(DEEPAI_URL, {
    method: 'POST',
    headers: {
      'Api-Key': process.env.DEEPAI_API_KEY || '',
    },
    body: new URLSearchParams({ text: prompt }),
  });
  if (!res.ok) throw new Error(`DeepAI ${res.status}`);
  const json = await res.json();
  const url = json.output_url || json.output?.url;
  if (!url) throw new Error('DeepAI: no output_url');
  return { url, provider: 'deepai' as const };
}

async function stability(prompt: string) {
  const key = process.env.STABILITY_API_KEY;
  if (!key) throw new Error('Stability: no key');
  const res = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
    },
    body: (() => {
      const form = new FormData();
      form.append('prompt', prompt);
      form.append('output_format', 'png');
      return form;
    })(),
  });
  if (!res.ok) throw new Error(`Stability ${res.status}`);
  const json = await res.json();
  const b64 = json.image;
  if (!b64) throw new Error('Stability: no image');
  return { url: `data:image/png;base64,${b64}`, provider: 'stability' as const };
}

const handler: Handler = async (event) => {
  try {
    const { prompt, provider = process.env.VITE_IMAGE_PROVIDER ?? 'fallback' } =
      (event.queryStringParameters as any) || {};

    if (!prompt || typeof prompt !== 'string') {
      return { statusCode: 400, body: 'Missing ?prompt=' };
    }

    const run = async () => {
      if (provider === 'deepai') return await deepai(prompt);
      if (provider === 'stability') return await stability(prompt);
      if (provider === 'dicebear') {
        const url = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(
          prompt.slice(0, 64)
        )}`;
        return { url, provider: 'dicebear' as const };
      }
      try {
        return await stability(prompt);
      } catch {
        try {
          return await deepai(prompt);
        } catch {
          const url = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${encodeURIComponent(
            prompt.slice(0, 64)
          )}`;
          return { url, provider: 'dicebear' as const };
        }
      }
    };

    const result = await run();
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: `Image generation failed: ${err?.message || 'unknown error'}`,
    };
  }
};

export { handler };

import { getSelectedProvider, haveDeepAI, haveStability } from './providers';

type GenOpts = { prompt: string; size?: number };

type ProviderName = 'deepai' | 'stability';

type GeneratedImage = { url: string; provider: ProviderName };

async function generateWithDeepAI({ prompt, size = 1024 }: GenOpts): Promise<GeneratedImage> {
  const key = import.meta.env.VITE_DEEPAI_API_KEY;
  if (!key) throw new Error('deepai:key-missing');

  const form = new FormData();
  form.append('text', prompt);
  form.append('grid_size', '1');
  form.append('width', String(size));
  form.append('height', String(size));

  const res = await fetch('https://api.deepai.org/api/text2img', {
    method: 'POST',
    headers: { 'Api-Key': key },
    body: form,
  });

  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`deepai:${res.status}:${t}`);
  }

  const data = await res.json();
  if (!data.output_url) throw new Error('deepai:no-output');
  return { url: data.output_url as string, provider: 'deepai' };
}

async function generateWithStability({ prompt, size = 1024 }: GenOpts): Promise<GeneratedImage> {
  const key = import.meta.env.VITE_STABILITY_API_KEY || import.meta.env.STABILITY_API_KEY;
  if (!key) throw new Error('stability:key-missing');

  const res = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      text_prompts: [{ text: prompt }],
      width: size,
      height: size,
      cfg_scale: 7,
      samples: 1,
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`stability:${res.status}:${t}`);
  }

  const json = await res.json();
  const b64: string | undefined = json?.artifacts?.[0]?.base64;
  if (!b64) throw new Error('stability:no-output');

  const binary = atob(b64);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    buffer[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([buffer], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  return { url, provider: 'stability' };
}

export async function generateImage(opts: GenOpts): Promise<GeneratedImage> {
  const primary = getSelectedProvider();
  const order: ProviderName[] = primary === 'deepai' ? ['deepai', 'stability'] : ['stability', 'deepai'];

  for (const provider of order) {
    try {
      if (provider === 'deepai') {
        if (!haveDeepAI()) throw new Error('deepai:key-missing');
        return await generateWithDeepAI(opts);
      }
      if (!haveStability()) throw new Error('stability:key-missing');
      return await generateWithStability(opts);
    } catch (err) {
      // Try the next provider in the order.
    }
  }

  throw new Error('no-provider-available');
}

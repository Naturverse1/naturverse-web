import type { Handler } from '@netlify/functions';
import { randomBytes } from 'node:crypto';

const STABILITY_KEY = process.env.STABILITY_API_KEY ?? '';
const DICEBEAR_STYLE = process.env.DICEBEAR_STYLE || 'adventurer';
const DICEBEAR_FORMAT = process.env.DICEBEAR_FORMAT || 'png';
const DEFAULT_SIZE = 1024;
const parsedSize = Number.parseInt(process.env.AVATAR_SIZE || String(DEFAULT_SIZE), 10);
const IMG_SIZE = clampSize(Number.isFinite(parsedSize) ? parsedSize : DEFAULT_SIZE, DEFAULT_SIZE);

const json = (status: number, body: unknown) => ({
  statusCode: status,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

type GeneratePayload = {
  prompt?: string;
  seed?: string | number;
  negativePrompt?: string;
  width?: number;
  height?: number;
  size?: string;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'method_not_allowed' });
  }

  let payload: GeneratePayload = {};
  if (event.body) {
    try {
      payload = JSON.parse(event.body);
    } catch {
      return json(400, { error: 'invalid_json' });
    }
  }

  const prompt = typeof payload.prompt === 'string' ? payload.prompt.trim() : '';
  const seedValue = normalizeSeed(payload.seed);
  const negativePrompt =
    typeof payload.negativePrompt === 'string' ? payload.negativePrompt.trim() : undefined;
  const dims = parseDimensions(payload.width, payload.height, payload.size);

  const stabilityResult = await maybeGenerateWithStability({
    prompt,
    negativePrompt,
    seed: seedValue,
    width: dims.width,
    height: dims.height,
  });

  if (stabilityResult?.ok) {
    return json(200, stabilityResult.payload);
  }

  return await generateWithDicebear(seedValue);
};

type StabilityRequest = {
  prompt: string;
  negativePrompt?: string;
  seed?: string;
  width: number;
  height: number;
};

type StabilitySuccess = {
  ok: true;
  payload: {
    source: 'stability';
    mime: string;
    imageBase64: string;
    remaining?: number | null;
  };
};

type StabilityFailure = { ok: false };

type StabilityResult = StabilitySuccess | StabilityFailure;

async function maybeGenerateWithStability(options: StabilityRequest): Promise<StabilityResult> {
  if (!STABILITY_KEY || !options.prompt) {
    return { ok: false };
  }

  try {
    const form = new FormData();
    form.set('prompt', options.prompt);
    form.set('output_format', 'webp');
    form.set('mode', 'text-to-image');
    form.set('aspect_ratio', '1:1');
    form.set('width', String(options.width));
    form.set('height', String(options.height));

    if (options.negativePrompt) {
      form.set('negative_prompt', options.negativePrompt);
    }

    if (options.seed) {
      form.set('seed', options.seed);
    }

    const resp = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STABILITY_KEY}`,
        Accept: 'application/json',
      },
      body: form,
    });

    const remainingHeader = resp.headers.get('x-ratelimit-remaining');
    const remaining = remainingHeader ? Number(remainingHeader) : undefined;

    if (resp.ok) {
      const data = (await resp.json()) as any;
      const imageBase64 = data?.image ?? data?.images?.[0]?.image;
      if (imageBase64) {
        return {
          ok: true,
          payload: {
            source: 'stability',
            mime: 'image/webp',
            imageBase64,
            remaining: Number.isFinite(remaining) ? remaining : undefined,
          },
        };
      }
    } else {
      const detail = await resp.text().catch(() => '');
      console.warn('Stability response not OK', resp.status, detail);
    }
  } catch (error) {
    console.error('Stability generate failed, using fallback', error);
  }

  return { ok: false };
}

type DicebearResult = {
  source: 'dicebear';
  mime: string;
  imageBase64: string;
};

async function generateWithDicebear(seed?: string) {
  const finalSeed = seed || cryptoRandomString();
  const url =
    `https://api.dicebear.com/9.x/${encodeURIComponent(DICEBEAR_STYLE)}/${encodeURIComponent(
      DICEBEAR_FORMAT,
    )}` +
    `?seed=${encodeURIComponent(finalSeed)}&size=${IMG_SIZE}&radius=0&backgroundType=none`;

  const response = await fetch(url);
  if (!response.ok) {
    return json(502, { error: 'dicebear_failed' });
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const mime =
    DICEBEAR_FORMAT === 'svg'
      ? 'image/svg+xml'
      : DICEBEAR_FORMAT === 'webp'
        ? 'image/webp'
        : 'image/png';

  const payload: DicebearResult = {
    source: 'dicebear',
    mime,
    imageBase64: buffer.toString('base64'),
  };

  return json(200, payload);
}

function normalizeSeed(seed: string | number | undefined): string | undefined {
  if (typeof seed === 'number') {
    if (Number.isFinite(seed)) return String(Math.floor(seed));
    return undefined;
  }
  if (typeof seed === 'string') {
    const trimmed = seed.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  return undefined;
}

function parseDimensions(
  widthRaw: unknown,
  heightRaw: unknown,
  sizeRaw: unknown,
): { width: number; height: number } {
  let width = Number(widthRaw);
  let height = Number(heightRaw);

  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    if (typeof sizeRaw === 'string') {
      const parts = sizeRaw.toLowerCase().split('x');
      if (parts.length === 2) {
        const [w, h] = parts.map((p) => Number(p));
        if (Number.isFinite(w)) width = w;
        if (Number.isFinite(h)) height = h;
      }
    }
  }

  if (!Number.isFinite(width)) width = IMG_SIZE;
  if (!Number.isFinite(height)) height = IMG_SIZE;

  return {
    width: clampSize(Math.floor(width), IMG_SIZE),
    height: clampSize(Math.floor(height), IMG_SIZE),
  };
}

function clampSize(value: number, fallback: number) {
  if (!Number.isFinite(value) || value <= 0) return fallback;
  if (value < 128) return 128;
  if (value > 2048) return 2048;
  return value;
}

function cryptoRandomString() {
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const arr = new Uint8Array(16);
    globalThis.crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return randomBytes(16).toString('hex');
}

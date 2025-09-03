import type { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const IMAGES_BUCKET = process.env.IMAGES_BUCKET || 'avatars';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// force portrait so UI looks consistent with Pick cards
const PORTRAIT = '1024x1536';

// small helper
const asBuf = async (url: string) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch failed ${r.status}`);
  const ab = await r.arrayBuffer();
  return Buffer.from(ab);
};

const json = (code: number, body: unknown) => ({
  statusCode: code,
  headers: {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
  },
  body: JSON.stringify(body),
});

type Payload = {
  prompt?: string;
  userId?: string;
  name?: string;
  sourceImageUrl?: string;
  maskImageUrl?: string;
};

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'Method not allowed' });
    }

    const body = (event.body ?? '').trim();
    if (!body) return json(400, { error: 'Missing JSON body' });

    const { prompt, userId, name, sourceImageUrl, maskImageUrl } =
      JSON.parse(body) as Payload;

    if (!prompt && !sourceImageUrl) {
      return json(400, { error: 'Provide prompt or sourceImageUrl' });
    }

    // ---- 1) Generate/Edit via OpenAI (no deprecated response_format) ----
    let b64: string | undefined;

    if (sourceImageUrl) {
      const image = await asBuf(sourceImageUrl);
      const mask = maskImageUrl ? await asBuf(maskImageUrl) : undefined;

      const edit = await openai.images.edits({
        model: 'gpt-image-1',
        prompt: prompt ?? '',
        image,
        ...(mask ? { mask } : {}),
        size: PORTRAIT,
      });

      b64 = edit.data?.[0]?.b64_json;
    } else {
      const gen = await openai.images.generate({
        model: 'gpt-image-1',
        prompt: prompt ?? '',
        size: PORTRAIT,
      });
      b64 = gen.data?.[0]?.b64_json;
    }

    if (!b64) return json(502, { error: 'No image returned from OpenAI' });

    // ---- 2) Upload to Supabase Storage ----
    const buffer = Buffer.from(b64, 'base64');
    const folder = `ai/${userId || 'anon'}`; // no leading slash
    const filename = `${Date.now()}.png`;
    const path = `${folder}/${filename}`;

    const { error: upErr } = await supabase
      .storage
      .from(IMAGES_BUCKET)
      .upload(path, buffer, {
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000',
        upsert: true,
      });
    if (upErr) return json(500, { error: `Upload failed: ${upErr.message}` });

    // public URL (v2 SDK)
    const { data: pub } = supabase
      .storage
      .from(IMAGES_BUCKET)
      .getPublicUrl(path);

    const image_url = pub?.publicUrl;
    if (!image_url) return json(500, { error: 'Could not resolve public URL' });

    // ---- 3) Upsert DB row ----
    const display = name?.trim() || 'Navatar';
    const { error: dbErr } = await supabase
      .from('avatars')
      .upsert(
        {
          user_id: userId ?? null,
          name: display,
          category: 'generate',
          method: 'generate',
          image_url,
        },
        { onConflict: 'user_id' }
      );
    if (dbErr) return json(500, { error: `DB error: ${dbErr.message}` });

    return json(200, { image_url, width: 1024, height: 1536 });
  } catch (e: any) {
    // pass through useful details when possible
    const status =
      e?.status ||
      e?.response?.status ||
      500;

    const message =
      e?.message ||
      e?.response?.data?.error?.message ||
      'Server error';

    return json(status, { error: message });
  }
};


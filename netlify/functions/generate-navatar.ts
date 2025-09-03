import type { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// ── ENV
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const IMAGES_BUCKET = process.env.IMAGES_BUCKET || 'avatars';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// fetch a remote image into a Buffer (for edits)
async function fetchAsBuffer(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch failed: ${r.status} ${r.statusText}`);
  const ab = await r.arrayBuffer();
  return Buffer.from(ab);
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const {
      prompt,
      user_id,
      name,
      sourceImageUrl,
      maskImageUrl,
    } = JSON.parse(event.body || '{}') as {
      prompt?: string;
      user_id?: string;
      name?: string;
      sourceImageUrl?: string;
      maskImageUrl?: string;
    };

    if (!prompt && !sourceImageUrl) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Provide prompt or sourceImageUrl' }),
      };
    }

    // ── 1) Generate or edit with OpenAI (do NOT pass response_format)
    let b64: string;

    if (sourceImageUrl) {
      const image = await fetchAsBuffer(sourceImageUrl);
      const mask = maskImageUrl ? await fetchAsBuffer(maskImageUrl) : undefined;

      const edited = await openai.images.edits({
        model: 'gpt-image-1',
        prompt: prompt || 'edit image',
        image,
        ...(mask ? { mask } : {}),
        size: '1024x1024',
      });

      b64 = edited.data[0].b64_json!;
    } else {
      const gen = await openai.images.generate({
        model: 'gpt-image-1',
        prompt: prompt!,
        size: '1024x1024',
      });
      b64 = gen.data[0].b64_json!;
    }

    if (!b64) {
      return {
        statusCode: 502,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Image generation returned empty data' }),
      };
    }

    // ── 2) Upload to Supabase Storage (ensure .png extension)
    const buffer = Buffer.from(b64, 'base64');
    const filename = `ai/${user_id || 'anon'}/${Date.now()}.png`;
    const { error: upErr } = await supabase.storage
      .from(IMAGES_BUCKET)
      .upload(filename, buffer, { contentType: 'image/png', upsert: true });

    if (upErr) {
      return {
        statusCode: 500,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: `Upload failed: ${upErr.message}` }),
      };
    }

    // public URL (bucket needs public read; you already enabled this)
    const pub = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(filename);
    const image_url = pub.data.publicUrl;

    if (!image_url) {
      return {
        statusCode: 500,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Could not resolve public URL' }),
      };
    }

    // ── 3) Upsert DB row
    const { error: dbErr } = await supabase
      .from('avatars')
      .upsert(
        {
          user_id: user_id || null,
          name: name || 'AI avatar',
          method: 'ai',
          category: 'generate',
          image_url,
        },
        { onConflict: 'user_id' }
      );

    if (dbErr) {
      return {
        statusCode: 500,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: `DB upsert failed: ${dbErr.message}` }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ image_url }),
    };
  } catch (e: any) {
    const code = e?.status || 500;
    const msg =
      e?.response?.data?.error?.message ||
      e?.message ||
      'Unknown server error';
    return {
      statusCode: code,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: msg }),
    };
  }
};

export default handler;


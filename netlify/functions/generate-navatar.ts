// netlify/functions/generate-navatar.ts
import type { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { toFile } from 'openai/uploads';

// ---- ENV ----
// These must exist in Netlify site > Site configuration > Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

// Bucket name in Supabase Storage (public)
const BUCKET = 'avatars';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// helper: fetch a remote image into a Buffer
async function fetchAsBuffer(url: string): Promise<Buffer> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch failed (${r.status}) for ${url}`);
  const arrayBuf = await r.arrayBuffer();
  return Buffer.from(arrayBuf);
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method not allowed' };
    }

    type Payload = {
      prompt?: string;
      user_id?: string;
      name?: string;
      sourceImageUrl?: string; // optional for EDIT / MERGE
      maskImageUrl?: string; // optional transparent mask
    };

    const { prompt, user_id, name, sourceImageUrl, maskImageUrl } = JSON.parse(
      event.body || '{}',
    ) as Payload;

    if (!prompt && !sourceImageUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Provide a prompt or a sourceImageUrl.' }),
      };
    }

    // ---- 1) Generate or Edit via OpenAI ----
    // Default 1024 for nice quality
    let b64: string;

    if (sourceImageUrl) {
      // EDIT/MERGE path
      const imageBuf = await fetchAsBuffer(sourceImageUrl);
      const maskBuf = maskImageUrl ? await fetchAsBuffer(maskImageUrl) : undefined;

      const imageFile = await toFile(imageBuf, 'image.png', { type: 'image/png' });
      const maskFile = maskBuf
        ? await toFile(maskBuf, 'mask.png', { type: 'image/png' })
        : undefined;

      const edited = await openai.images.edit({
        model: 'gpt-image-1',
        image: imageFile,
        // include mask if provided (transparent regions are replaced)
        ...(maskFile ? { mask: maskFile } : {}),
        prompt: prompt || '',
        size: '1024x1024',
      });

      b64 = edited.data[0].b64_json!;
    } else {
      // PURE GENERATION
      const gen = await openai.images.generate({
        model: 'gpt-image-1',
        prompt: prompt!,
        size: '1024x1024',
      });
      b64 = gen.data[0].b64_json!;
    }

    if (!b64) {
      return { statusCode: 502, body: JSON.stringify({ error: 'No image returned.' }) };
    }

    // ---- 2) Upload the image to Supabase Storage ----
    const buffer = Buffer.from(b64, 'base64');
    const uid = user_id || 'anon';
    const fileName = `ai/${uid}/${Date.now()}.png`;

    const { error: upErr } = await supabase.storage.from(BUCKET).upload(fileName, buffer, {
      contentType: 'image/png',
      cacheControl: 'public, max-age=31536000, immutable',
      upsert: true,
    });

    if (upErr) {
      return { statusCode: 500, body: JSON.stringify({ error: upErr.message }) };
    }

    const pub = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    const image_url = pub.data?.publicUrl;
    if (!image_url) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Could not resolve public URL', path: fileName }),
      };
    }

    // ---- 3) Upsert DB row ----
    const { error: insErr } = await supabase.from('avatars').upsert(
      {
        user_id: user_id ?? null,
        name: name || 'Navatar',
        category: 'generate',
        method: 'ai',
        image_url,
      },
      { onConflict: 'user_id', ignoreDuplicates: false },
    );

    if (insErr) {
      return { statusCode: 500, body: JSON.stringify({ error: insErr.message }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ image_url }),
      headers: { 'content-type': 'application/json' },
    };
  } catch (e: any) {
    // Bubble up helpful OpenAI or Supabase messaging
    const msg =
      e?.response?.data?.error?.message || e?.message || 'Unexpected error in generate-navatar';
    const code = e?.status || 500;
    return {
      statusCode: code,
      body: JSON.stringify({ error: msg }),
      headers: { 'content-type': 'application/json' },
    };
  }
};

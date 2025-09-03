import type { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const OPENAI_KEY = process.env.OPENAI_API_KEY!;
const BUCKET = process.env.IMAGES_BUCKET || 'avatars';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_KEY });

// Tiny helper to fetch a remote image as a Buffer (for edits/var.)
async function fetchAsBuffer(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch failed ${r.status}`);
  const arrayBuf = await r.arrayBuffer();
  return Buffer.from(arrayBuf);
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { prompt, userId, name, sourceImageUrl, maskImageUrl } = JSON.parse(event.body || '{}') as {
      prompt: string;
      userId: string;
      name?: string;
      sourceImageUrl?: string;
      maskImageUrl?: string;
    };

    if (!userId) throw new Error('Missing userId');
    if (!prompt && !sourceImageUrl) throw new Error('Provide a prompt or a source image');

    // --- 1) Generate / Edit image via OpenAI ---
    // We default to 1024 image for quality, can change to 512 to save cost.
    // When sourceImageUrl is provided we do an "edit"; else we do "generation".
    let imageB64: string;

    if (sourceImageUrl) {
      // EDIT (optionally with mask)
      const image = await fetchAsBuffer(sourceImageUrl);
      const mask = maskImageUrl ? await fetchAsBuffer(maskImageUrl) : undefined;

      const edit = await openai.images.edits({
        model: 'gpt-image-1',
        prompt,
        image,
        ...(mask ? { mask } : {}),
        size: '1024x1024',
        response_format: 'b64_json',
      });
      imageB64 = edit.data[0].b64_json!;
    } else {
      // PURE GENERATION
      const gen = await openai.images.generate({
        model: 'gpt-image-1',
        prompt,
        size: '1024x1024',
        response_format: 'b64_json',
      });
      imageB64 = gen.data[0].b64_json!;
    }

    const imageBuffer = Buffer.from(imageB64, 'base64');

    // --- 2) Upload to Supabase Storage ---
    // path: userId/<timestamp>.png
    const filename = `${Date.now()}.png`;
    const path = `${userId}/${filename}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, imageBuffer, {
        contentType: 'image/png',
        cacheControl: 'public, max-age=31536000, immutable',
        upsert: true,
      });
    if (upErr) throw upErr;

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const image_url = pub.publicUrl;
    if (!image_url) throw new Error('Could not get public URL');

    // --- 3) Upsert DB row ---
    const { error: dbErr } = await supabase
      .from('avatars')
      .upsert(
        {
          user_id: userId,
          name: name || 'Navatar',
          category: 'generate',
          method: 'generate',
          image_url,
        },
        { onConflict: 'user_id', ignoreDuplicates: false }
      );
    if (dbErr) throw dbErr;

    return {
      statusCode: 200,
      body: JSON.stringify({ image_url }),
      headers: { 'content-type': 'application/json' },
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e?.message || String(e) }),
      headers: { 'content-type': 'application/json' },
    };
  }
};


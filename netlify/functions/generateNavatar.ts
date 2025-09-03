import { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const auth = event.headers['authorization'] || '';
    const jwt = auth.replace('Bearer ', '');
    const { data: { user }, error: authErr } =
      await supabase.auth.getUser(jwt);
    if (authErr || !user) return { statusCode: 401, body: 'Unauthorized' };

    const form = JSON.parse(event.body || '{}') as {
      prompt: string;
      sourceImageUrl?: string;
      maskImageUrl?: string;
      name?: string;
    };
    const { prompt, sourceImageUrl, maskImageUrl, name } = form;
    if (!prompt?.trim()) return { statusCode: 400, body: 'Missing prompt' };

    const { count } = await supabase
      .from('navatar_generations')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24*60*60*1000).toISOString())
      .eq('user_id', user.id);
    if ((count ?? 0) >= 10) {
      return { statusCode: 429, body: 'Daily limit reached' };
    }

    const { data: gen, error: insErr } = await supabase
      .from('navatar_generations')
      .insert({
        user_id: user.id,
        prompt,
        source_image_url: sourceImageUrl || null,
        mask_image_url: maskImageUrl || null,
        status: 'queued'
      })
      .select()
      .single();
    if (insErr) throw insErr;

    // 2) call OpenAI Images (text-to-image or image edit)
    // gpt-image-1 supports prompt-only or image[]+prompt
    const images: any[] = [];
    if (sourceImageUrl) images.push({ image: sourceImageUrl });
    if (maskImageUrl) images.push({ mask: maskImageUrl });
    const result = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
      ...(images.length ? { image: images } : {})
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) throw new Error('No image returned');

    const bytes = Buffer.from(b64, 'base64');
    const fileName = crypto.randomUUID() + '.png';
    const path = `generated/${user.id}/${fileName}`;

    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, bytes, { contentType: 'image/png', upsert: false });
    if (upErr) throw upErr;

    const { data: pub } = await supabase.storage
      .from('avatars')
      .getPublicUrl(path);
    const publicUrl = pub?.publicUrl;

    await supabase.from('navatar_generations').update({
      status: 'succeeded',
      result_image_url: publicUrl,
      completed_at: new Date().toISOString()
    }).eq('id', gen.id);

    await supabase.from('avatars').upsert({
      user_id: user.id,
      name: name || 'Navatar',
      category: 'avatar',
      method: 'generate',
      image_url: publicUrl
    }, { onConflict: 'user_id', ignoreDuplicates: false });

    return {
      statusCode: 200,
      body: JSON.stringify({ image_url: publicUrl, id: gen.id })
    };
  } catch (e: any) {
    return { statusCode: 500, body: String(e?.message || e) };
  }
};


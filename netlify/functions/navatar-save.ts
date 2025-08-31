import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function b64ToBuffer(b64: string) {
  return Buffer.from(b64, 'base64');
}

export const handler: Handler = async (event) => {
  try {
    const { user_id, name, navatar_id, b64_png } = JSON.parse(event.body || '{}');
    if (!user_id || !name || !navatar_id || !b64_png) {
      return { statusCode: 400, body: 'Missing fields' };
    }

    const path = `u/${user_id}/${navatar_id}.png`;
    const file = b64ToBuffer(b64_png);

    const up = await supa.storage.from('navatars-user').upload(path, file, {
      contentType: 'image/png',
      upsert: true,
    });
    if (up.error) return { statusCode: 500, body: up.error.message };

    const { data: pub } = supa.storage.from('navatars-user').getPublicUrl(path);
    const imgUrl = pub?.publicUrl;

    const { error: insErr } = await supa.from('navatars').upsert({
      id: navatar_id,
      slug: navatar_id,
      name,
      rarity: 'starter',
      price_cents: 0,
      img: imgUrl,
      tags: ['user'],
      active: true,
      created_by: user_id,
      user_generated: true,
    });
    if (insErr) return { statusCode: 500, body: insErr.message };

    await supa.from('owned_navatars').upsert(
      {
        user_id,
        navatar_id,
      },
      { onConflict: 'user_id,navatar_id' }
    );

    const { data: profile } = await supa
      .from('profiles')
      .select('navatar_id')
      .eq('id', user_id)
      .maybeSingle();
    if (!profile?.navatar_id) {
      await supa.from('profiles').update({ navatar_id }).eq('id', user_id);
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, img: imgUrl }) };
  } catch (e: any) {
    return { statusCode: 500, body: JSON.stringify({ error: e?.message || 'Server error' }) };
  }
};

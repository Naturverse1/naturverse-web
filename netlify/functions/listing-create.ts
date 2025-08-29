import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const handler: Handler = async (event) => {
  try {
    const { seller_user_id, navatar_id, currency, price_cents, price_natur, fee_bps = 1000, royalty_bps = 500 } = JSON.parse(event.body || '{}');
    if (!seller_user_id || !navatar_id || !currency) return resp(400, 'Missing fields');
    if (currency === 'usd' && (!Number.isInteger(price_cents) || price_cents <= 0)) return resp(400, 'Invalid price_cents');
    if (currency === 'natur' && (!price_natur || Number(price_natur) <= 0)) return resp(400, 'Invalid price_natur');

    const { data: own } = await supa
      .from('owned_navatars')
      .select('user_id')
      .eq('user_id', seller_user_id)
      .eq('navatar_id', navatar_id)
      .maybeSingle();
    if (!own) return resp(400, 'Seller does not own this Navatar');

    const { data, error } = await supa
      .from('navatar_listings')
      .insert({
        seller_user_id,
        navatar_id,
        currency,
        price_cents: price_cents ?? null,
        price_natur: price_natur ?? null,
        fee_bps,
        royalty_bps,
        status: 'active',
      })
      .select()
      .single();
    if (error) return resp(500, error.message);
    return resp(200, { ok: true, listing: data });
  } catch (e: any) {
    return resp(500, e?.message || 'Server error');
  }
};

function resp(code: number, body: any) {
  return { statusCode: code, body: typeof body === 'string' ? body : JSON.stringify(body) };
}

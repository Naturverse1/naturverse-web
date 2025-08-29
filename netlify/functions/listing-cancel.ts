import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const handler: Handler = async (event) => {
  try {
    const { seller_user_id, listing_id } = JSON.parse(event.body || '{}');
    if (!seller_user_id || !listing_id) return resp(400, 'Missing');

    const { data: listing } = await supa
      .from('navatar_listings')
      .select('*')
      .eq('id', listing_id)
      .maybeSingle();
    if (!listing) return resp(404, 'Listing not found');
    if (listing.seller_user_id !== seller_user_id) return resp(403, 'Not your listing');
    if (listing.status !== 'active') return resp(400, 'Listing not active');

    const { error } = await supa
      .from('navatar_listings')
      .update({ status: 'cancelled' })
      .eq('id', listing_id);
    if (error) return resp(500, error.message);
    return resp(200, { ok: true });
  } catch (e: any) {
    return resp(500, e?.message || 'Server error');
  }
};

function resp(code: number, body: any) {
  return { statusCode: code, body: typeof body === 'string' ? body : JSON.stringify(body) };
}

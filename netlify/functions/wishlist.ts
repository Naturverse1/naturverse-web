import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials are not configured');
}

const s = createClient(supabaseUrl, supabaseKey);

type WishlistRequest = {
  userId?: string;
  product?: {
    slug?: string;
    name?: string;
    price_cents?: number;
    price?: number;
    image_url?: string | null;
  };
  action?: 'add' | 'remove';
};

const response = (body: unknown, status = 200) => ({ statusCode: status, body: JSON.stringify(body) });

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return response({ error: 'method' }, 405);
  }

  let payload: WishlistRequest;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return response({ error: 'invalid_json' }, 400);
  }

  const normalizedUserId = typeof payload.userId === 'string' && payload.userId.trim().length > 0 ? payload.userId.trim() : '';
  if (!normalizedUserId) {
    return response({ error: 'userId required' }, 400);
  }

  const action = payload.action === 'remove' ? 'remove' : 'add';
  const product = payload.product ?? {};
  const slug = typeof product.slug === 'string' && product.slug.trim().length > 0 ? product.slug.trim() : '';

  if (!slug) {
    return response({ error: 'product.slug required' }, 400);
  }

  if (action === 'remove') {
    const { error } = await s
      .from('user_wishlist')
      .delete()
      .eq('user_id', normalizedUserId)
      .eq('product_slug', slug);

    if (error) {
      return response({ error: error.message ?? 'Unable to update wishlist' }, 500);
    }

    return response({ ok: true, saved: false });
  }

  const name = typeof product.name === 'string' && product.name.trim().length > 0 ? product.name.trim() : '';
  const imageUrl = typeof product.image_url === 'string' && product.image_url.trim().length > 0 ? product.image_url.trim() : null;

  let priceCents: number | null = null;
  if (typeof product.price_cents === 'number' && Number.isFinite(product.price_cents)) {
    priceCents = Math.round(product.price_cents);
  } else if (typeof product.price === 'number' && Number.isFinite(product.price)) {
    priceCents = Math.round(product.price * 100);
  }

  if (!name) {
    return response({ error: 'product.name required' }, 400);
  }

  if (priceCents == null) {
    return response({ error: 'product.price_cents required' }, 400);
  }

  const { error } = await s.from('user_wishlist').insert({
    user_id: normalizedUserId,
    product_slug: slug,
    product_name: name,
    product_price_cents: priceCents,
    product_image: imageUrl,
  });

  if (error) {
    if ((error as any)?.code === '23505') {
      return response({ ok: true, saved: true });
    }
    return response({ error: error.message ?? 'Unable to update wishlist' }, 500);
  }

  return response({ ok: true, saved: true });
};

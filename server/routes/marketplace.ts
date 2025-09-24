import { Router } from 'express';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
  client = createClient(supabaseUrl, supabaseKey);
}

function requireClient(): SupabaseClient {
  if (!client) {
    throw new Error('Supabase service key not configured');
  }
  return client;
}

router.post('/demo-order', async (req, res) => {
  try {
    const supabase = requireClient();
    const { userId, lineItems, status = 'demo' } = req.body ?? {};

    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return res.status(400).json({ error: 'lineItems required' });
    }

    const payload: Record<string, unknown> = {
      line_items: lineItems,
      status,
    };

    if (typeof userId === 'string' && userId.trim().length > 0) {
      payload.user_id = userId.trim();
    }

    const { data, error } = await supabase
      .from('orders_demo')
      .insert(payload)
      .select('id, created_at')
      .single();

    if (error) {
      throw error;
    }

    return res.json({ ok: true, order: data });
  } catch (error: any) {
    const message = error?.message ?? 'Unable to save demo order';
    return res.status(500).json({ error: message });
  }
});

router.post('/wishlist', async (req, res) => {
  try {
    const supabase = requireClient();
    const { userId, product } = req.body ?? {};

    const normalizedUserId = typeof userId === 'string' && userId.trim().length > 0 ? userId.trim() : '';
    if (!normalizedUserId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const slug = typeof product?.slug === 'string' && product.slug.trim().length > 0 ? product.slug.trim() : '';
    const name = typeof product?.name === 'string' && product.name.trim().length > 0 ? product.name.trim() : '';
    const imageUrl = typeof product?.image_url === 'string' && product.image_url.trim().length > 0 ? product.image_url.trim() : null;

    let priceCents: number | null = null;
    if (typeof product?.price_cents === 'number' && Number.isFinite(product.price_cents)) {
      priceCents = Math.round(product.price_cents);
    } else if (typeof product?.price === 'number' && Number.isFinite(product.price)) {
      priceCents = Math.round(product.price * 100);
    }

    if (!slug) {
      return res.status(400).json({ error: 'product.slug required' });
    }
    if (!name) {
      return res.status(400).json({ error: 'product.name required' });
    }
    if (priceCents == null) {
      return res.status(400).json({ error: 'product.price_cents required' });
    }

    const { data: existing, error: selectError } = await supabase
      .from('user_wishlist')
      .select('id')
      .eq('user_id', normalizedUserId)
      .eq('product_slug', slug)
      .maybeSingle();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    if (existing?.id) {
      const { error } = await supabase
        .from('user_wishlist')
        .delete()
        .eq('id', existing.id);
      if (error) throw error;
      return res.json({ ok: true, saved: false });
    }

    const { error: insertError } = await supabase.from('user_wishlist').insert({
      user_id: normalizedUserId,
      product_slug: slug,
      product_name: name,
      product_price_cents: priceCents,
      product_image: imageUrl,
    });

    if (insertError) {
      if ((insertError as any)?.code === '23505') {
        return res.json({ ok: true, saved: true });
      }
      throw insertError;
    }

    return res.json({ ok: true, saved: true });
  } catch (error: any) {
    const message = error?.message ?? 'Unable to update wishlist';
    return res.status(500).json({ error: message });
  }
});

export default router;

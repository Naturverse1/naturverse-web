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
    const { userId, itemId } = req.body ?? {};

    if (!itemId || typeof itemId !== 'string') {
      return res.status(400).json({ error: 'itemId required' });
    }

    const normalizedUserId = typeof userId === 'string' && userId.trim().length > 0 ? userId.trim() : null;

    const query = supabase
      .from('wishlists')
      .select('id')
      .eq('item_id', itemId)
      .limit(1);

    if (normalizedUserId) {
      query.eq('user_id', normalizedUserId);
    } else {
      query.is('user_id', null);
    }

    const { data: existing, error: selectError } = await query.maybeSingle();
    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    if (existing?.id) {
      await supabase.from('wishlists').delete().eq('id', existing.id);
      return res.json({ ok: true, saved: false });
    }

    const insertPayload: Record<string, unknown> = { item_id: itemId };
    if (normalizedUserId) insertPayload.user_id = normalizedUserId;

    const { error: insertError } = await supabase.from('wishlists').insert(insertPayload);
    if (insertError) {
      throw insertError;
    }

    return res.json({ ok: true, saved: true });
  } catch (error: any) {
    const message = error?.message ?? 'Unable to update wishlist';
    return res.status(500).json({ error: message });
  }
});

export default router;

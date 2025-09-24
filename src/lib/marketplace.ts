import { supabase } from '@/lib/supabaseClient';

export type DemoLineItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export async function saveDemoOrder(items: DemoLineItem[]) {
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id ?? null;

  const resp = await fetch('/api/marketplace/demo-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lineItems: items, userId }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    const message = typeof err?.error === 'string' ? err.error : 'Unable to save demo order';
    throw new Error(message);
  }

  return resp.json() as Promise<{ ok: boolean; order?: { id: string } }>;
}

export async function toggleWishlistItem(itemId: string) {
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id ?? null;

  const resp = await fetch('/api/marketplace/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, userId }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    const message = typeof err?.error === 'string' ? err.error : 'Unable to update wishlist';
    throw new Error(message);
  }

  return resp.json() as Promise<{ ok: boolean; saved: boolean }>;
}

export async function fetchWishlistIds(): Promise<string[]> {
  const { data, error } = await supabase.from('wishlists').select('item_id');
  if (error) throw error;

  return (data ?? []).map((row) => row.item_id as string).filter(Boolean);
}

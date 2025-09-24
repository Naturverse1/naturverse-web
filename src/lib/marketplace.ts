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

export type WishlistProductPayload = {
  id: string;
  name: string;
  price?: number;
  image?: string;
  href?: string;
};

export type WishlistRow = {
  id: string;
  item_id: string;
  product_name: string;
  product_price: number | string | null;
  product_image: string | null;
  product_href: string | null;
  added_at: string | null;
  created_at: string | null;
};

export async function toggleWishlistItem(item: WishlistProductPayload) {
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id ?? null;

  const resp = await fetch('/api/marketplace/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item, userId }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => null);
    const message = typeof err?.error === 'string' ? err.error : 'Unable to update wishlist';
    throw new Error(message);
  }

  return resp.json() as Promise<{ ok: boolean; saved: boolean; item?: WishlistRow; id?: string }>;
}

export type WishlistItem = {
  id: string;
  itemId: string;
  name: string;
  price: number | null;
  image: string | null;
  href: string | null;
  addedAt: string | null;
};

export async function fetchWishlistItems(): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from('wishlists')
    .select('id, item_id, product_name, product_price, product_image, product_href, added_at, created_at')
    .order('added_at', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => {
    let price: number | null = null;
    if (typeof row.product_price === 'number') {
      price = row.product_price;
    } else if (typeof row.product_price === 'string') {
      const parsed = Number(row.product_price);
      price = Number.isFinite(parsed) ? parsed : null;
    }

    return {
      id: row.id,
      itemId: row.item_id,
      name: row.product_name || row.item_id,
      price,
      image: row.product_image ?? null,
      href: row.product_href ?? null,
      addedAt: row.added_at ?? row.created_at ?? null,
    };
  });
}

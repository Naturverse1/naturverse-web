import { supabase } from '@/lib/supabaseClient';
import type { MarketProduct, WishlistItem } from '@/types/market';

const WISHLIST_KEY = 'naturverse_wishlist_v1';
const LEGACY_KEY = 'nv:wishlist';

const readCache = () => {
  if (typeof window === 'undefined') return [] as string[];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const value = JSON.parse(raw) as unknown;
    return Array.isArray(value) ? (value as string[]) : [];
  } catch {
    return [];
  }
};

const writeCache = (items: string[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('wishlist:changed'));
};

const cacheKeyForItem = (item: WishlistItem) => item.product?.slug ?? item.product_id;

export async function getWishlist(): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from('user_wishlist')
    .select('id,user_id,product_id,created_at,product:products(id,slug,name,price_cents,image_url)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  const items = ((data ?? []) as unknown) as WishlistItem[];
  writeCache(items.map(cacheKeyForItem));
  return items;
}

export async function addToWishlist(product: MarketProduct): Promise<WishlistItem> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error('Please sign in to use your wishlist.');

  const { data, error } = await supabase
    .from('user_wishlist')
    .upsert([{ user_id: user.id, product_id: product.id }], {
      onConflict: 'user_id,product_id',
      ignoreDuplicates: true,
    })
    .select('id,user_id,product_id,created_at,product:products(id,slug,name,price_cents,image_url)')
    .single();

  if (error) throw error;
  const item = (data as unknown) as WishlistItem;
  const cache = readCache();
  const key = cacheKeyForItem(item) || product.slug || product.id;
  if (!cache.includes(key)) {
    writeCache([key, ...cache]);
  } else {
    writeCache(cache);
  }
  return item;
}

export async function removeFromWishlist(itemId: string, productSlug?: string, productId?: string) {
  const { error } = await supabase.from('user_wishlist').delete().eq('id', itemId);
  if (error) throw error;
  const cache = readCache();
  if (productSlug || productId) {
    const next = cache.filter((value) => value !== productSlug && value !== productId);
    writeCache(next);
  } else {
    writeCache(cache);
  }
}

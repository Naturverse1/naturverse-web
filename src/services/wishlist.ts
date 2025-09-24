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

function toDbRow(product: MarketProduct, userId: string) {
  return {
    user_id: userId,
    product_name: product.name,
    product_price: product.price ?? null,
    product_image: product.image ?? null,
  };
}

export async function getWishlist(): Promise<WishlistItem[]> {
  const { data, error } = await supabase.from('wishlist').select('*').order('added_at', { ascending: false });
  if (error) throw error;
  const items = (data ?? []) as WishlistItem[];
  writeCache(items.map((item) => item.product_name));
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
    .from('wishlist')
    .insert([toDbRow(product, user.id)])
    .select('*')
    .single();

  if (error) throw error;
  const item = data as WishlistItem;
  const cache = readCache();
  if (!cache.includes(item.product_name)) {
    writeCache([...cache, item.product_name]);
  } else {
    writeCache(cache);
  }
  return item;
}

export async function removeFromWishlist(itemId: string, productName?: string) {
  const { error } = await supabase.from('wishlist').delete().eq('id', itemId);
  if (error) throw error;
  if (productName) {
    const cache = readCache();
    writeCache(cache.filter((name) => name !== productName));
  } else {
    writeCache(readCache());
  }
}

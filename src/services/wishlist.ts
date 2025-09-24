import { supabase } from '@/lib/supabaseClient';
import type { MarketProduct, WishlistItem } from '@/types/market';

const WISHLIST_KEY = 'naturverse_wishlist_v1';
const LEGACY_KEY = 'nv:wishlist';

const WISHLIST_SELECT = `
  id,
  user_id,
  product_id,
  created_at,
  product:products (
    id,
    slug,
    name,
    price_cents,
    image_url
  )
`;

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
  const unique = Array.from(new Set(items.filter((item) => typeof item === 'string' && item.length > 0)));
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(unique));
  window.dispatchEvent(new Event('wishlist:changed'));
};

const extractSlugs = (items: WishlistItem[]) =>
  items
    .map((item) => item.product?.slug)
    .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0);

export async function getWishlist(): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from('user_wishlist')
    .select(WISHLIST_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  const items = (data ?? []) as WishlistItem[];
  writeCache(extractSlugs(items));
  return items;
}

export async function addToWishlist(product: MarketProduct): Promise<WishlistItem> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error('Please sign in to use your wishlist.');

  const productId = product.productId;
  if (!productId) {
    throw new Error('Product not available yet.');
  }

  const { data, error } = await supabase
    .from('user_wishlist')
    .insert([{ user_id: user.id, product_id: productId }])
    .select(WISHLIST_SELECT)
    .single();

  if (error) throw error;
  const item = data as WishlistItem;
  const cache = readCache();
  if (!cache.includes(product.id)) {
    writeCache([...cache, product.id]);
  } else {
    writeCache(cache);
  }
  return item;
}

export async function removeFromWishlist(itemId: string, productSlug?: string) {
  const { error } = await supabase.from('user_wishlist').delete().eq('id', itemId);
  if (error) throw error;
  if (productSlug) {
    const cache = readCache();
    writeCache(cache.filter((slug) => slug !== productSlug));
  } else {
    writeCache(readCache());
  }
}

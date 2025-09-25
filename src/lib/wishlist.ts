import { supabase } from '@/lib/supabaseClient';

export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  image_url: string | null;
};

export type WishlistProduct = ProductSummary & { created_at?: string };

type WishlistResult =
  | { ok: true }
  | { ok: false; reason: 'auth' | 'not-found' | 'db' };

type WishlistResultWithProduct =
  | ({ ok: true } & { product: ProductSummary })
  | ({ ok: false; reason: 'auth' | 'not-found' | 'db' });

async function currentUserId(): Promise<string | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('wishlist currentUserId error', error);
    return null;
  }

  return user?.id ?? null;
}

async function fetchProductSummary(slug: string): Promise<ProductSummary | null> {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, price_cents, image_url')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('wishlist fetchProductSummary error', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    price_cents: data.price_cents ?? 0,
    image_url: data.image_url ?? null,
  } satisfies ProductSummary;
}

async function getProductIdBySlug(slug: string): Promise<string | null> {
  const summary = await fetchProductSummary(slug);
  return summary?.id ?? null;
}

export async function upsertWishlist(slug: string): Promise<WishlistResultWithProduct> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, reason: 'auth' };

  const product = await fetchProductSummary(slug);
  if (!product) return { ok: false, reason: 'not-found' };

  const { error } = await supabase
    .from('user_wishlist')
    .upsert(
      { user_id: userId, product_id: product.id },
      { onConflict: 'user_id,product_id' }
    );

  if (error) {
    console.error('wishlist upsert error', error);
    return { ok: false, reason: 'db' };
  }

  return { ok: true, product };
}

export async function removeFromWishlist(slug: string): Promise<WishlistResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, reason: 'auth' };

  const productId = await getProductIdBySlug(slug);
  if (!productId) return { ok: false, reason: 'not-found' };

  const { error } = await supabase
    .from('user_wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    console.error('wishlist remove error', error);
    return { ok: false, reason: 'db' };
  }

  return { ok: true };
}

type WishlistViewRow = {
  id: string;
  slug: string;
  name: string;
  price_cents: number | null;
  image_url: string | null;
  added_at: string;
};

export async function fetchWishlist(): Promise<ProductSummary[]> {
  const userId = await currentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('user_wishlist_view')
    .select('id, slug, name, price_cents, image_url, added_at')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });

  if (error) {
    console.error('wishlist fetch error', error);
    return [];
  }

  return ((data ?? []) as WishlistViewRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    price_cents: row.price_cents ?? 0,
    image_url: row.image_url ?? null,
  } satisfies ProductSummary));
}

export async function isInWishlist(slug: string): Promise<boolean> {
  const userId = await currentUserId();
  if (!userId) return false;

  const productId = await getProductIdBySlug(slug);
  if (!productId) return false;

  const { data, error } = await supabase
    .from('user_wishlist')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .limit(1);

  if (error) {
    console.error('wishlist exists error', error);
    return false;
  }

  return (data?.length ?? 0) > 0;
}

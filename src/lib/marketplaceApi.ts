import { supabase } from '@/lib/supabaseClient';

type SupabaseProductRow = {
  id: string;
  slug: string;
  name: string;
  price_cents: number | null;
  image_url: string | null;
};

type WishlistQueryRow = {
  id: string;
  created_at: string;
  products: SupabaseProductRow | SupabaseProductRow[] | null;
};

type CartQueryRow = {
  id: string;
  qty: number | null;
  products: SupabaseProductRow | SupabaseProductRow[] | null;
};

// -------------- Wishlist --------------

export async function addToWishlist(productId: string) {
  const { data, error } = await supabase
    .from('user_wishlist')
    .insert({ product_id: productId })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

export async function removeFromWishlist(wishlistRowId: string) {
  const { error } = await supabase
    .from('user_wishlist')
    .delete()
    .eq('id', wishlistRowId);

  if (error) throw error;
}

export type WishlistItem = {
  wishlist_id: string;
  product_id: string;
  name: string;
  price_cents: number;
  image_url: string | null;
  slug: string;
  created_at: string;
};

export async function getWishlist(): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from('user_wishlist')
    .select(
      `
        id,
        created_at,
        products:product_id (
          id,
          slug,
          name,
          price_cents,
          image_url
        )
      `
    )
    .order('created_at', { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as WishlistQueryRow[];

  return rows.flatMap((row) => {
    const product = Array.isArray(row.products)
      ? row.products[0] ?? null
      : row.products;

    if (!product) return [];

    return [
      {
        wishlist_id: row.id,
        product_id: product.id,
        slug: product.slug,
        name: product.name,
        price_cents: product.price_cents ?? 0,
        image_url: product.image_url ?? null,
        created_at: row.created_at,
      },
    ];
  });
}

// -------------- Cart (server table version) --------------

export type CartLine = {
  cart_item_id: string;
  product_id: string;
  qty: number;
  name: string;
  price_cents: number;
  image_url: string | null;
  slug: string;
};

export async function getCart(): Promise<CartLine[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select(
      `
        id,
        qty,
        products:product_id (
          id,
          slug,
          name,
          price_cents,
          image_url
        )
      `
    )
    .order('id', { ascending: true });

  if (error) throw error;

  const rows = (data ?? []) as CartQueryRow[];

  return rows.flatMap((row) => {
    const product = Array.isArray(row.products)
      ? row.products[0] ?? null
      : row.products;

    if (!product) return [];

    return [
      {
        cart_item_id: row.id,
        product_id: product.id,
        qty: typeof row.qty === 'number' ? row.qty : 1,
        slug: product.slug,
        name: product.name,
        price_cents: product.price_cents ?? 0,
        image_url: product.image_url ?? null,
      },
    ];
  });
}

export async function addToCart(productId: string, qty = 1) {
  const { data, error } = await supabase
    .from('cart_items')
    .insert({ product_id: productId, qty })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

export async function updateCartQty(cartItemId: string, qty: number) {
  const { error } = await supabase
    .from('cart_items')
    .update({ qty })
    .eq('id', cartItemId);
  if (error) throw error;
}

export async function removeFromCart(cartItemId: string) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);
  if (error) throw error;
}

import { supabase } from '@/lib/supabaseClient';

export async function getWishlistIds(): Promise<Set<string>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data, error } = await supabase
    .from('wishlist_items')
    .select('product:products(slug)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  const slugs = (data ?? [])
    .map((row: any) => row?.product?.slug as string | undefined)
    .filter((slug): slug is string => Boolean(slug));

  return new Set(slugs);
}

export async function toggleWishlist(productSlug: string): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('not_signed_in');

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', productSlug)
    .maybeSingle();

  if (productError) throw productError;
  if (!product?.id) throw new Error('product_not_found');

  const productId = product.id as string;

  const { data, error } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle();

  if (error) throw error;

  if (data?.id) {
    const { error: deleteError } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);
    if (deleteError) throw deleteError;
    return false;
  }

  const { error: insertError } = await supabase
    .from('wishlist_items')
    .insert({ user_id: user.id, product_id: productId });

  if (insertError) throw insertError;
  return true;
}

export type WishlistProduct = {
  id: string;
  slug: string;
  title: string;
  price_cents: number;
  image_url: string;
};

export async function listWishlistProducts(): Promise<WishlistProduct[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('wishlist_items')
    .select('product:products(id, slug, title, price_cents, image_url)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? [])
    .map((row: any) => row?.product)
    .filter((product): product is WishlistProduct => Boolean(product?.id && product?.slug));
}

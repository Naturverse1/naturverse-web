import { supabase } from '@/lib/supabaseClient';
import type { MarketProduct, WishlistItem } from '@/types/market';

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
  return (data ?? []) as WishlistItem[];
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
  return data as WishlistItem;
}

export async function removeFromWishlist(itemId: string) {
  const { error } = await supabase.from('wishlist').delete().eq('id', itemId);
  if (error) throw error;
}

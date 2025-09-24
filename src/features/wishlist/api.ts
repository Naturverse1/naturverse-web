import type { User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/types/db';

export type WishlistRow = Database['public']['Tables']['user_wishlist']['Row'];
export type WishlistInsert = Database['public']['Tables']['user_wishlist']['Insert'];

function notifyWishlistChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('wishlist:changed'));
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user ?? null;
}

export async function listWishlist(): Promise<WishlistRow[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_wishlist')
    .select('*')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function addToWishlist(params: {
  slug: string;
  name: string;
  price_cents: number;
  image_url?: string | null;
}): Promise<WishlistRow | null> {
  const user = await getCurrentUser();
  if (!user) throw new Error('SIGN_IN_REQUIRED');

  const payload: WishlistInsert = {
    user_id: user.id,
    product_slug: params.slug,
    product_name: params.name,
    product_price_cents: Math.round(params.price_cents),
    product_image: params.image_url ?? null,
  };

  const { data, error } = await supabase
    .from('user_wishlist')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    if ((error as any)?.code === '23505') {
      return null; // duplicate entry, treat as success
    }
    throw error;
  }

  notifyWishlistChanged();
  return data;
}

export async function removeFromWishlist(slug: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error('SIGN_IN_REQUIRED');

  const { error } = await supabase
    .from('user_wishlist')
    .delete()
    .eq('user_id', user.id)
    .eq('product_slug', slug);

  if (error) throw error;
  notifyWishlistChanged();
}

export async function countWishlist(): Promise<number> {
  const user = await getCurrentUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from('user_wishlist')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) throw error;
  return count ?? 0;
}

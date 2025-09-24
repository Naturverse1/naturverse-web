import { supabase } from '@/lib/supabaseClient';
import type { Product } from '@/lib/commerce/types';
import { mapProductRecord, type ProductRecord } from '@/lib/commerce/products';

export type WishlistMap = Record<string, boolean>;

export type WishlistEntry = {
  product: Product;
  wishedAt: string;
};

export async function getWishlistMap(): Promise<WishlistMap> {
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes?.user;
  if (!user) return {};

  const { data, error } = await supabase
    .from('wishlist_items')
    .select('product_id');

  if (error) throw error;
  const map: WishlistMap = {};
  for (const row of data ?? []) {
    if (row?.product_id) {
      map[row.product_id] = true;
    }
  }
  return map;
}

export async function toggleWishlist(productId: string): Promise<boolean> {
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes?.user;
  if (!user) {
    throw new Error('not_signed_in');
  }

  const { data: existing, error: selectError } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('product_id', productId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (selectError && selectError.code !== 'PGRST116') {
    throw selectError;
  }

  if (existing) {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('product_id', productId)
      .eq('user_id', user.id);
    if (error) throw error;
    return false;
  }

  const { error } = await supabase
    .from('wishlist_items')
    .upsert(
      { user_id: user.id, product_id: productId },
      { onConflict: 'user_id,product_id' }
    );
  if (error) throw error;
  return true;
}

export async function fetchWishlistEntries(): Promise<WishlistEntry[]> {
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes?.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from('wishlist_items')
    .select('created_at, product:products (*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  const entries: WishlistEntry[] = [];
  for (const row of data ?? []) {
    const rawProduct = row?.product as ProductRecord | ProductRecord[] | null;
    const productRecord = Array.isArray(rawProduct)
      ? rawProduct[0] ?? null
      : rawProduct;
    if (!productRecord) continue;
    const product = mapProductRecord(productRecord);
    const createdAt = typeof row?.created_at === 'string' ? row.created_at : new Date().toISOString();
    entries.push({ product, wishedAt: createdAt });
  }
  return entries;
}

import { supabase } from '@/lib/supabaseClient';
import type { Product } from './types';

export type ProductRecord = {
  id: string;
  slug: string;
  title?: string | null;
  description?: string | null;
  price_cents?: number | null;
  image_url?: string | null;
};

export function mapProductRecord(row: ProductRecord): Product {
  const price = typeof row.price_cents === 'number' ? row.price_cents / 100 : 0;
  const image = row.image_url && row.image_url.length > 0 ? row.image_url : '';
  return {
    id: row.id,
    slug: row.slug,
    name: row.title?.trim() || row.slug,
    price,
    image,
    description: row.description?.trim() || undefined,
  };
}

function ensureProduct(row: ProductRecord | null): Product | null {
  if (!row) return null;
  if (!row.id || !row.slug) return null;
  return mapProductRecord(row);
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!data) return [];
  return data.map(mapProductRecord);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return ensureProduct(data);
}

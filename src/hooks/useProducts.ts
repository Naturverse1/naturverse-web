import { supabase } from '@/lib/supabaseClient';

export type Product = {
  slug: string;
  name: string;
  price_cents: number;
  image_url: string;
  description?: string;
};

export const FALLBACK_PRODUCTS: Product[] = [
  {
    slug: 'turian-plush',
    name: 'Turian Plush',
    price_cents: 2400,
    image_url: '/Marketplace/Turianplushie.png',
    description: 'Soft plushy buddy.',
  },
  {
    slug: 'navatar-tee',
    name: 'Navatar Tee',
    price_cents: 1800,
    image_url: '/Marketplace/Turiantshirt.png',
    description: 'Classic tee with Navatar print.',
  },
  {
    slug: 'sticker-pack',
    name: 'Sticker Pack',
    price_cents: 600,
    image_url: '/Marketplace/Stickerpack.png',
    description: 'Assorted Naturverse stickers.',
  },
];

const fallbackMap = new Map(FALLBACK_PRODUCTS.map((product) => [product.slug, product] as const));

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('slug,name,price_cents,image_url,description')
      .eq('active', true)
      .order('name');
    if (error) throw error;
    const products = (data ?? []) as Product[];
    if (!products.length) {
      return FALLBACK_PRODUCTS;
    }
    return products.map((product) => ({
      ...product,
      image_url: product.image_url || fallbackMap.get(product.slug)?.image_url || '/Marketplace/Turianplushie.png',
    }));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('fetchProducts fallback', error);
    }
    return FALLBACK_PRODUCTS;
  }
}

export function findFallbackProduct(slug: string) {
  return fallbackMap.get(slug);
}

export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

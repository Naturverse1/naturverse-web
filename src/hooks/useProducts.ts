import { supabase } from '@/lib/supabaseClient';

type ProductRecord = {
  slug: string;
  name: string;
  price_cents: number;
  image_url: string | null;
  description?: string | null;
};

export type Product = {
  slug: string;
  name: string;
  price_cents: number;
  image_url: string;
  description?: string;
};

export const DEFAULT_PRODUCT_IMAGE = '/Marketplace/placeholder.svg';

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

export function resolveProductImage(slug: string, imageUrl?: string | null) {
  if (imageUrl && imageUrl.trim().length > 0) {
    return imageUrl;
  }
  const fallback = fallbackMap.get(slug);
  if (fallback?.image_url) {
    return fallback.image_url;
  }
  return DEFAULT_PRODUCT_IMAGE;
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('slug,name,price_cents,image_url,description')
      .eq('active', true)
      .order('name');
    if (error) throw error;
    const products = (data ?? []) as ProductRecord[];
    if (!products.length) {
      return FALLBACK_PRODUCTS;
    }
    return products.map((product) => ({
      slug: product.slug,
      name: product.name,
      price_cents: product.price_cents,
      image_url: resolveProductImage(product.slug, product.image_url ?? undefined),
      description: product.description ?? undefined,
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

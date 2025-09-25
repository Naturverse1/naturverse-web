import type { ProductSummary } from '@/lib/wishlist';

export type MarketProduct = {
  id: string;
  name: string;
  price?: number;
  image?: string;
};

export type WishlistItem = ProductSummary;

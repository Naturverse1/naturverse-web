import type { Database } from './db';

export type MarketProduct = {
  id: string;
  name: string;
  price?: number;
  image?: string;
};

export type WishlistItem = Database['public']['Tables']['user_wishlist']['Row'];

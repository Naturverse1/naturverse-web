export type MarketProduct = {
  /**
   * Public slug used across the marketplace UI.
   */
  id: string;
  /**
   * Backing Supabase product identifier used for persistence.
   */
  productId?: string;
  name: string;
  price?: number;
  image?: string;
};

export type WishlistProduct = {
  id: string;
  slug: string;
  name: string;
  price_cents: number | null;
  image_url: string | null;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: WishlistProduct | null;
};

export type MarketProduct = {
  id: string;
  slug: string;
  name: string;
  price?: number;
  image?: string;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    slug: string;
    name: string;
    price_cents: number;
    image_url: string | null;
  } | null;
};

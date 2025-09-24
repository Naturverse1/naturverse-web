export type MarketProduct = {
  id: string;
  name: string;
  price?: number;
  image?: string;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  product_name: string;
  product_price: number | null;
  product_image: string | null;
  added_at: string;
};

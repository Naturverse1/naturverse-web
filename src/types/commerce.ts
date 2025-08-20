export type Product = { id: string; title: string; priceTokens: number; image?: string; desc?: string };
export type CartItem = { product_id: string; title: string; price_tokens: number; qty: number; image?: string };
export type Address = {
  name: string; email: string; phone?: string;
  address1: string; address2?: string; city: string; region?: string; postal: string; country: string
};
export type Order = { id: string; device_id: string; total_tokens: number; created_at: string };
export type TokenBalance = { device_id: string; balance: number };


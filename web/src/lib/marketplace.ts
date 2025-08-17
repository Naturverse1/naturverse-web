export type Product = { id:string; slug:string; title:string; description?:string; base_price_cents:number; category:string; preview_url?:string; };
export type Variant = { id:string; product_id:string; name:string; price_cents:number; sku?:string; };
export type CartItem = { product: Product; variant: Variant; qty:number; navatar_url?:string; personalization?: Record<string, any>; };
const CART_KEY = "nv:cart";
export function getCart(): CartItem[] { try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; } }
export function saveCart(items: CartItem[]) { localStorage.setItem(CART_KEY, JSON.stringify(items)); }
export function cartTotalCents(items: CartItem[]) { return items.reduce((s,i)=>s + i.variant.price_cents * i.qty, 0); }
export const fmtMoney = (c:number)=>`$${(c/100).toFixed(2)}`;

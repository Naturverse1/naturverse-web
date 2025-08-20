import type { CartItem } from "../types/commerce";

const K = "natur-cart-v1";

export function readCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(K) || "[]"); } catch { return []; }
}
export function writeCart(items: CartItem[]) {
  localStorage.setItem(K, JSON.stringify(items));
}
export function addToCart(item: CartItem) {
  const cart = readCart();
  const i = cart.findIndex(c => c.product_id === item.product_id);
  if (i >= 0) cart[i].qty += item.qty; else cart.push(item);
  writeCart(cart);
  return cart;
}
export function removeFromCart(product_id: string) {
  writeCart(readCart().filter(c => c.product_id !== product_id));
}
export function clearCart() { writeCart([]); }
export const cartTotal = (cart: CartItem[]) => cart.reduce((s,c)=> s + c.price_tokens*c.qty, 0);


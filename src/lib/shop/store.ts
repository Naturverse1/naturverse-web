import { CartLine } from "./types";

const WK = "naturverse.shop.wishlist.v1";   // string[] of itemIds
const CK = "naturverse.shop.cart.v1";       // CartLine[]

const read = <T>(k: string, d: T) => {
  try { return JSON.parse(localStorage.getItem(k) || "null") ?? d; } catch { return d; }
};
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export function loadWishlist(): string[] { return read<string[]>(WK, []); }
export function toggleWish(id: string) {
  const s = new Set(loadWishlist());
  s.has(id) ? s.delete(id) : s.add(id);
  write(WK, [...s]);
  return [...s];
}

export function loadCart(): CartLine[] { return read<CartLine[]>(CK, []); }
export function addToCart(id: string, qty = 1) {
  const cart = loadCart();
  const line = cart.find(l => l.id === id);
  if (line) line.qty += qty; else cart.push({ id, qty });
  write(CK, cart); return cart;
}
export function setQty(id: string, qty: number) {
  let cart = loadCart().map(l => (l.id === id ? { id, qty } : l)).filter(l => l.qty > 0);
  write(CK, cart); return cart;
}
export function removeLine(id: string) {
  const cart = loadCart().filter(l => l.id !== id);
  write(CK, cart); return cart;
}
export function clearCart() { write(CK, []); }


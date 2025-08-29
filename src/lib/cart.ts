export type ProductType = 'digital' | 'physical';
export type Product = { id: string; name: string; price: number; type: ProductType; };
export type CartItem = Product & { qty: number };

const LS_KEY = 'naturverse_cart_v1';
let cart: CartItem[] = load();

function load(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
  catch { return []; }
}
function save() { localStorage.setItem(LS_KEY, JSON.stringify(cart)); }

type Listener = (items: CartItem[]) => void;
const listeners = new Set<Listener>();
function notify() { listeners.forEach(l => l([...cart])); }

export function getCart() { return [...cart]; }
export function subscribe(fn: Listener) { listeners.add(fn); return () => { listeners.delete(fn); }; }
export function clearCart() { cart = []; save(); notify(); }
export function addToCart(p: Product, qty = 1) {
  const i = cart.findIndex(c => c.id === p.id);
  if (i >= 0) cart[i].qty += qty;
  else cart.push({ ...p, qty });
  save(); notify();
}
export function setQty(id: string, qty: number) {
  cart = cart.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i);
  save(); notify();
}
export function removeFromCart(id: string) {
  cart = cart.filter(i => i.id !== id);
  save(); notify();
}
export function cartTotalCents() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

// Hook
import { useEffect, useState } from 'react';
export function useCart() {
  const [items, set] = useState<CartItem[]>(getCart());
  useEffect(() => subscribe(set), []);
  return { items, addToCart, setQty, removeFromCart, clearCart, totalCents: cartTotalCents() };
}

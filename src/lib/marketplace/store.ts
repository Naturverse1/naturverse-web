// super lightweight client-side store for demo parity with your ZIP
import products from "../../content/marketplace/products.json";
import orders from "../../content/marketplace/orders.json";

export type Product = { id:string; name:string; price:number; image?:string; description?:string };
export type CartItem = { id:string; qty:number };

let cart: CartItem[] = [];

export const Market = {
  all(): Product[] { return products as Product[]; },
  one(id: string): Product | undefined { return (products as Product[]).find(p => p.id === id); },

  cart(): CartItem[] { return cart; },
  add(id: string, qty = 1) {
    const i = cart.findIndex(c => c.id === id);
    if (i >= 0) cart[i].qty += qty; else cart.push({ id, qty });
  },
  remove(id: string) { cart = cart.filter(c => c.id !== id); },
  clear() { cart = []; },
  total(): number {
    return cart.reduce((sum, c) => {
      const p = Market.one(c.id);
      return sum + (p ? p.price * c.qty : 0);
    }, 0);
  },

  orders() { return orders; },
  order(id: string) { return orders.find((o:any) => o.id === id); }
};

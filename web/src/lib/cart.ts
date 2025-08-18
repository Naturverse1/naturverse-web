export type CartLine = {
  id: string;          // product id
  name: string;
  price: number;       // unit price
  image?: string;
  options?: Record<string, string>; // size/color/etc
  qty: number;
};
const KEY = 'nv_cart_v1';

function read(): CartLine[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function write(lines: CartLine[]) { localStorage.setItem(KEY, JSON.stringify(lines)); }

export function getCart(): CartLine[] { return read(); }

export function addToCart(line: Omit<CartLine,'qty'> & { qty?: number }) {
  const qty = Math.max(1, line.qty ?? 1);
  const cart = read();
  const key = JSON.stringify({ id: line.id, options: line.options || {} });
  const idx = cart.findIndex(l => JSON.stringify({ id: l.id, options: l.options || {} }) === key);
  if (idx >= 0) { cart[idx].qty += qty; } else { cart.push({ ...line, qty }); }
  write(cart); return cart;
}

export function setQty(id: string, options: Record<string,string>|undefined, qty: number) {
  const cart = read();
  const key = JSON.stringify({ id, options: options || {} });
  const idx = cart.findIndex(l => JSON.stringify({ id: l.id, options: l.options || {} }) === key);
  if (idx >= 0) {
    if (qty <= 0) cart.splice(idx, 1);
    else cart[idx].qty = qty;
    write(cart);
  }
  return cart;
}

export function removeLine(id: string, options?: Record<string,string>) {
  const cart = read().filter(l => !(l.id === id && JSON.stringify(l.options||{}) === JSON.stringify(options||{})));
  write(cart); return cart;
}

export function clearCart() { write([]); }

export function totals(lines: CartLine[]) {
  const subtotal = lines.reduce((s,l)=> s + l.price * l.qty, 0);
  const shipping = lines.length ? 5 : 0;        // flat demo shipping
  const tax = +(subtotal * 0.07).toFixed(2);    // 7% demo tax
  const total = +(subtotal + shipping + tax).toFixed(2);
  return { subtotal:+subtotal.toFixed(2), shipping, tax, total };
}

import { loadOrders } from './orders';
import type { Order, Address } from './types';
import { loadCart, saveCart, CartLine } from './cartPersist';

// Orders
export function getOrders(): Order[] {
  return loadOrders();
}

export function getOrderById(id: string): Order | null {
  return getOrders().find((o) => o.id === id) || null;
}

// Addresses
const ADDR_KEY = 'natur_addresses';

interface AddressBook { list: Address[]; defaultId?: string }

export function getAddresses(): AddressBook {
  try {
    const raw = localStorage.getItem(ADDR_KEY);
    if (!raw) return { list: [] };
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.list)) {
      return { list: parsed.list as Address[], defaultId: parsed.defaultId };
    }
  } catch {}
  return { list: [] };
}

export function saveAddresses(book: AddressBook) {
  try {
    localStorage.setItem(ADDR_KEY, JSON.stringify(book));
  } catch {}
}

export function getDefaultAddress(): Address | null {
  const { list, defaultId } = getAddresses();
  return list.find((a) => a.id === defaultId) || null;
}

export function setDefaultAddress(id: string) {
  const book = getAddresses();
  book.defaultId = id;
  saveAddresses(book);
}

export function upsertAddress(addr: Address) {
  const book = getAddresses();
  const idx = book.list.findIndex((a) => a.id === addr.id);
  if (idx >= 0) book.list[idx] = addr;
  else book.list.push(addr);
  saveAddresses(book);
}

export function deleteAddress(id: string) {
  const book = getAddresses();
  book.list = book.list.filter((a) => a.id !== id);
  if (book.defaultId === id) book.defaultId = book.list[0]?.id;
  saveAddresses(book);
}

// Reorder
export function reorder(order: Order): CartLine[] {
  const cart = loadCart();
  for (const line of order.lines) {
    const variant = (line.meta?.variant as any) || undefined;
    const existing = cart.find(
      (c) =>
        c.id === line.id &&
        JSON.stringify(c.variant || {}) === JSON.stringify(variant || {})
    );
    const qty = line.qty;
    if (existing) {
      existing.qty = Math.min(99, existing.qty + qty);
    } else {
      cart.push({
        id: line.id,
        name: line.name,
        image: line.meta?.image,
        priceNatur: line.priceNatur,
        qty: Math.min(99, qty),
        variant,
      });
    }
  }
  saveCart(cart);
  return cart;
}

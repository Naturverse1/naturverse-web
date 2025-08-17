export type NaturLine = {
  id: string;
  name: string;
  qty: number;
  priceNatur: number; // unit price
  meta?: Record<string, any>;
};

export type NaturOrder = {
  id: string; // ulid-ish or tx hash fallback
  createdAt: number; // epoch ms
  totalNatur: number;
  lines: NaturLine[];
  txHash?: string;
  network?: string; // e.g. "Polygon Amoy"
  address?: string; // buyer address
};

const KEY = 'natur_orders';

export function loadOrders(): NaturOrder[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveOrders(list: NaturOrder[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export function getOrder(id: string): NaturOrder | undefined {
  return loadOrders().find((o) => o.id === id);
}

export function addOrder(o: NaturOrder) {
  const list = loadOrders();
  list.unshift(o);
  saveOrders(list);
}

export function fmtDate(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return '';
  }
}

export function explorerUrl(txHash?: string) {
  if (!txHash) return '';
  const base = import.meta.env.VITE_BLOCK_EXPLORER || '';
  // Accept either ".../" or empty; fall back to hash only
  return base ? `${base.replace(/\/+$/, '')}/tx/${txHash}` : '';
}


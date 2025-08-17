export type NaturOrder = {
  id: string;
  ts: number;
  address?: string;
  items: { id: string; name: string; qty: number; price: number }[];
  subtotal: number;
  fee: number;
  total: number;
  status: 'Paid' | 'Failed' | 'Canceled' | 'Placed';
  txHash?: string;
};
const KEY = 'natur_orders';

export function listOrders(): NaturOrder[] {
  return JSON.parse(localStorage.getItem(KEY) || '[]').sort(
    (a: NaturOrder, b: NaturOrder) => b.ts - a.ts
  );
}
export function getOrder(id: string) {
  return listOrders().find((o) => o.id === id) || null;
}
export function addOrder(o: NaturOrder) {
  const all = listOrders();
  localStorage.setItem(KEY, JSON.stringify([o, ...all]));
}
export function updateOrder(id: string, patch: Partial<NaturOrder>) {
  const all = listOrders().map((o) => (o.id === id ? { ...o, ...patch } : o));
  localStorage.setItem(KEY, JSON.stringify(all));
}

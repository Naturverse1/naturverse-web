export type Order = {
  id: string;              // uuid
  createdAt: string;       // ISO
  email: string;
  shippingName: string;
  shippingAddress: string;
  lines: { id:string; name:string; price:number; qty:number; image?:string }[];
  amounts: { subtotal:number; shipping:number; tax:number; total:number };
};
const KEY = 'nv_orders_v1';

export function getOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
export function saveOrder(o: Order) {
  const list = getOrders();
  list.unshift(o);
  localStorage.setItem(KEY, JSON.stringify(list));
}

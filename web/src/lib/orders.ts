export type Receipt = {
  id: string;                    // timestamp or tx hash
  ts: number;                    // Date.now()
  totalNatur: number;
  items: { id:string; name:string; qty:number; priceNatur:number }[];
  txHash?: string;
};

const KEY = 'natur_orders';

export function loadOrders(): Receipt[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function saveOrder(r: Receipt) {
  const all = loadOrders();
  localStorage.setItem(KEY, JSON.stringify([r, ...all]));
}

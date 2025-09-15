export type NaturTxType = 'grant' | 'spend';
export interface NaturTx {
  id: string;
  at: number;
  type: NaturTxType;
  amount: number;
  note?: string;
}
export interface NaturWallet {
  label: string;
  address: string;
  starting: number;
  txs: NaturTx[];
}

const KEY = (uid: string) => `naturbank:${uid}`;

export function loadWallet(uid: string, starting = 120): NaturWallet {
  const raw = localStorage.getItem(KEY(uid));
  if (!raw) {
    const w: NaturWallet = { label: 'My Wallet', address: '', starting, txs: [] };
    localStorage.setItem(KEY(uid), JSON.stringify(w));
    return w;
  }
  try {
    const parsed = JSON.parse(raw) as NaturWallet;
    return { label: 'My Wallet', address: '', starting, txs: [], ...parsed };
  } catch {
    const w: NaturWallet = { label: 'My Wallet', address: '', starting, txs: [] };
    localStorage.setItem(KEY(uid), JSON.stringify(w));
    return w;
  }
}

export function saveWallet(uid: string, partial: Partial<NaturWallet>) {
  const curr = loadWallet(uid);
  const next = { ...curr, ...partial };
  localStorage.setItem(KEY(uid), JSON.stringify(next));
  return next;
}

export function balanceOf(w: NaturWallet): number {
  const delta = w.txs.reduce((sum, t) => sum + (t.type === 'grant' ? t.amount : -t.amount), 0);
  return w.starting + delta;
}

export function addTx(uid: string, tx: Omit<NaturTx, 'id' | 'at'>) {
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  const at = Date.now();
  const w = loadWallet(uid);
  const next: NaturWallet = { ...w, txs: [{ id, at, ...tx }, ...w.txs] };
  localStorage.setItem(KEY(uid), JSON.stringify(next));
  return next;
}

export * from './naturbank/api';

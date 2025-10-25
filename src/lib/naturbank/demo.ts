export type Tx = { when:number; type:'grant'|'spend'; amount:number; note?:string };

const LS_BAL = 'naturbank:balance';
const LS_TXS = 'naturbank:txs';

export function getBalance(): number {
  return Number(localStorage.getItem(LS_BAL) ?? 120);
}

export function getTxs(): Tx[] {
  try { return JSON.parse(localStorage.getItem(LS_TXS) ?? '[]'); }
  catch { return []; }
}

function set(bal:number, txs:Tx[]) {
  localStorage.setItem(LS_BAL, String(bal));
  localStorage.setItem(LS_TXS, JSON.stringify(txs));
}

export function grantNatur(amount:number, note='Daily grant') {
  const bal = getBalance() + amount;
  const txs: Tx[] = [{ when: Date.now(), type:'grant' as const, amount, note }, ...getTxs()];
  set(bal, txs);
  return { bal, txs };
}

export function spendNatur(amount:number, note='Shop demo') {
  const bal = getBalance() - amount;
  const txs: Tx[] = [{ when: Date.now(), type:'spend' as const, amount: -amount, note }, ...getTxs()];
  set(bal, txs);
  return { bal, txs };
}

// NEW: demo peer-to-peer transfer (sender only; crediting recipient will be server-side later)
export function transferTo(_recipient:string, amount:number, note='p2p demo') {
  if (!_recipient?.trim()) throw new Error('Recipient is required');
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Amount must be positive');
  return spendNatur(amount, note);
}

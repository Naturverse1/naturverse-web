import { NaturBankState, NaturTxn } from './types';

const KEY = 'naturbank_demo_v1';

const DEFAULT_STATE: NaturBankState = {
  balance: 120,
  wallet: { label: 'My Wallet', address: '' },
  txns: [],
};

export function loadState(): NaturBankState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as NaturBankState;
    // cheap guards
    if (!parsed || typeof parsed.balance !== 'number') return DEFAULT_STATE;
    return parsed;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(next: NaturBankState) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function applyTxn(state: NaturBankState, txn: NaturTxn): NaturBankState {
  const delta = txn.type === 'grant' ? txn.amount : -txn.amount;
  const balance = Math.max(0, state.balance + delta);
  return {
    ...state,
    balance,
    txns: [txn, ...state.txns].slice(0, 200), // simple cap
  };
}

import { Tx, Wallet } from "./types";

const WA = "naturverse.bank.wallet.v1";
const TL = "naturverse.bank.ledger.v1";
const BAL = "naturverse.bank.balance.v1";

const read = <T>(k: string, d: T) => { try { return JSON.parse(localStorage.getItem(k) || "null") ?? d; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export function getWallet(): Wallet | null { return read<Wallet | null>(WA, null); }
export function createDemoWallet(): Wallet {
  const w: Wallet = {
    address: "nvtr_demo_" + Math.random().toString(36).slice(2, 10),
    createdAt: Date.now()
  };
  write(WA, w);
  if (read<number>(BAL, -1) === -1) write(BAL, 120);       // seed 120 NATUR once
  if (read<Tx[]>(TL, []).length === 0) {
    seedLedger();
  }
  return w;
}

export function getBalance(): number { return read<number>(BAL, 0); }
export function getLedger(): Tx[] { return read<Tx[]>(TL, []); }

export function addTx(t: Tx) {
  const list = [t, ...getLedger()].slice(0, 100);
  write(TL, list);
  const bal = getBalance() + (t.type === "spend" ? -t.amount : t.amount);
  write(BAL, Math.max(0, Math.round(bal)));
}

function seedLedger() {
  const now = Date.now();
  const demo: Tx[] = [
    { id: "tx1", ts: now - 86400000 * 3, type: "earn", amount: 50, memo: "Quest reward — Park clean-up" },
    { id: "tx2", ts: now - 86400000 * 2, type: "grant", amount: 40, memo: "Welcome grant" },
    { id: "tx3", ts: now - 86400000, type: "spend", amount: 10, memo: "Sticker pack (wishlist)" },
    { id: "tx4", ts: now - 3600000, type: "earn", amount: 40, memo: "Observation streak" }
  ];
  write(TL, demo);
  write(BAL, 120);
}

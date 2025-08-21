export type Tx = {
  id: string;      // uuid-ish
  ts: number;      // epoch ms
  type: "earn" | "spend" | "redeem" | "grant";
  amount: number;  // positive NATUR
  memo: string;
};
export type Wallet = { address: string; createdAt: number };

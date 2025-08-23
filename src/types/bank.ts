export type NaturWallet = {
  id: string;
  user_id: string;
  address: string;
  label?: string | null;
  created_at: string | null;
};

export type NaturTxn = {
  id: string;
  user_id: string;
  wallet_address: string;
  kind: "earn" | "spend" | "grant";
  amount: number; // positive numbers
  note?: string | null;
  created_at: string | null;
};

export type NaturWallet = {
  user_id: string;
  balance: number;
  updated_at: string | null;
};

export type NaturLedger = {
  id: string;
  user_id: string;
  delta: number;            // +earn / -spend
  reason: string | null;
  created_at: string | null;
};

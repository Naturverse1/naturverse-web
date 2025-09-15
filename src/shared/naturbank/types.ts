export type NaturTxnType = 'grant' | 'spend';

export interface NaturTxn {
  id: string;             // uuid
  ts: number;             // epoch ms
  type: NaturTxnType;
  amount: number;         // positive numbers; sign implied by type
  note?: string;
}

export interface NaturWallet {
  label: string;
  address: string;        // 0x.. or email/handle for now
}

export interface NaturBankState {
  balance: number;
  wallet: NaturWallet;
  txns: NaturTxn[];
}

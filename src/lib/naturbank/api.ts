import { supabase } from '../supabase-client';

export type Wallet = {
  id: string;
  user_id: string;
  label: string;
  address: string | null;
  balance: number;
};

export type Txn = {
  id: string;
  type: 'grant' | 'spend';
  amount: number;
  note?: string | null;
  created_at: string;
};

export async function getOrCreateWallet(userId: string): Promise<Wallet> {
  const { data: existing, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!error && existing) return existing as Wallet;

  const { data, error: insErr } = await supabase
    .from('wallets')
    .insert({ user_id: userId })
    .select()
    .single();
  if (insErr) throw insErr;
  return data as Wallet;
}

export async function saveWalletMeta(
  walletId: string,
  fields: Partial<Pick<Wallet, 'label' | 'address'>>
) {
  const { error } = await supabase
    .from('wallets')
    .update(fields)
    .eq('id', walletId);
  if (error) throw error;
}

export async function listTxns(walletId: string, userId: string): Promise<Txn[]> {
  const { data, error } = await supabase
    .from('wallet_txns')
    .select('id,type,amount,note,created_at')
    .eq('wallet_id', walletId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Txn[];
}

async function writeTxn(
  walletId: string,
  userId: string,
  type: 'grant' | 'spend',
  amount: number,
  note?: string
) {
  const { error } = await supabase
    .from('wallet_txns')
    .insert({ wallet_id: walletId, user_id: userId, type, amount, note: note ?? null });
  if (error) throw error;
}

export const grant = (
  walletId: string,
  userId: string,
  amount = 25,
  note?: string
) => writeTxn(walletId, userId, 'grant', amount, note);

export const spend = (
  walletId: string,
  userId: string,
  amount = 10,
  note?: string
) => writeTxn(walletId, userId, 'spend', amount, note);

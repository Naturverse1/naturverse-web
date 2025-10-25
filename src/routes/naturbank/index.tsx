import React, { useEffect, useMemo, useState } from 'react';
import WalletCard from '../../components/naturbank/WalletCard';
import SendCard from '../../components/naturbank/SendCard';
import BalanceCard from '../../components/naturbank/BalanceCard';
import TransactionsCard from '../../components/naturbank/TransactionsCard';
import {
  getOrCreateWallet,
  listTxns,
  grant,
  spend,
  transferTo,
  saveWalletMeta,
  type Wallet,
  type Txn,
} from '../../lib/naturbank';
import { useAuthUser } from '../../lib/useAuthUser';

export default function NaturBankPage() {
  const { user } = useAuthUser();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [txns, setTxns] = useState<Txn[]>([]);

  const refresh = async () => {
    if (!user) return;
    const w = await getOrCreateWallet(user.id);
    setWallet(w);
    setTxns(await listTxns(w.id, user.id));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const onSave = async (fields: { label: string; address: string }) => {
    if (!wallet) return;
    await saveWalletMeta(wallet.id, fields);
    await refresh();
  };

  const onGrant = async (note?: string) => {
    if (!wallet || !user) return;
    await grant(wallet.id, user.id, 25, note);
    await refresh();
  };

  const onSpend = async (note?: string) => {
    if (!wallet || !user) return;
    await spend(wallet.id, user.id, 10, note);
    await refresh();
  };

  const onSend = async (recipient: string, amount: number, note?: string) => {
    if (!user) return;
    await transferTo(user.id, recipient, amount, note);
    await refresh();
  };

  const styles = useMemo(() => ({
    page: { maxWidth: 920, margin: '0 auto' },
  }), []);

  return (
    <main className="naturbank-page" style={styles.page}>
      <nav className="breadcrumbs">
        <a href="/">Home</a> <span>/</span> <span className="current">NaturBank</span>
      </nav>

      <h1 className="title">NaturBank</h1>
      <p className="muted center">Local demo mode.</p>

      {wallet && (
        <>
          <WalletCard wallet={wallet} onSave={onSave} onGrant={onGrant} onSpend={onSpend} />
          <SendCard onSend={onSend} />
          <BalanceCard balance={wallet.balance} />
        </>
      )}
      <TransactionsCard txns={txns} />

      <section className="card">
        <p className="muted">
          Coming soon: real wallet connect, custodial accounts, on-chain mints, and marketplace redemption.
        </p>
      </section>
    </main>
  );
}

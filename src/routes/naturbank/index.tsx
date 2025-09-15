import React, { useMemo, useState } from 'react';
import WalletCard from '../../components/naturbank/WalletCard';
import BalanceCard from '../../components/naturbank/BalanceCard';
import TransactionsCard from '../../components/naturbank/TransactionsCard';
import { NaturBankState, NaturTxn } from '../../shared/naturbank/types';
import { applyTxn, loadState, saveState } from '../../shared/naturbank/storage';

function uuid() {
  return crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

export default function NaturBankPage() {
  const [state, setState] = useState<NaturBankState>(() => loadState());

  // actions
  const saveWallet = (next: NaturBankState['wallet']) => {
    const updated = { ...state, wallet: next };
    setState(updated); saveState(updated);
  };

  const addTxn = (type: 'grant' | 'spend', amount: number, note?: string) => {
    const txn: NaturTxn = { id: uuid(), ts: Date.now(), type, amount, note };
    const updated = applyTxn(state, txn);
    setState(updated); saveState(updated);
  };

  const onGrant = () => addTxn('grant', 25, 'Demo grant');
  const onSpend = () => addTxn('spend', 10, 'Demo spend');

  // simple page styles (scoped)
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

      <WalletCard wallet={state.wallet} onSave={saveWallet} onGrant={onGrant} onSpend={onSpend} />
      <BalanceCard balance={state.balance} />
      <TransactionsCard txns={state.txns} />

      <section className="card">
        <p className="muted">
          Coming soon: real wallet connect, custodial accounts, on-chain mints, and marketplace redemption.
        </p>
      </section>
    </main>
  );
}

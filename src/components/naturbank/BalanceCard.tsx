import React from 'react';
import { fmtNatur } from '../../shared/naturbank/format';

export default function BalanceCard({ balance }: { balance: number }) {
  return (
    <section className="card">
      <h3 className="h3">Balance</h3>
      <div className="center big">{fmtNatur(balance)}</div>
      <p className="hint">Starting demo balance: 120. Transactions apply on top.</p>
    </section>
  );
}

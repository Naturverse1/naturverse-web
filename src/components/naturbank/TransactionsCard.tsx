import React from 'react';
import type { Txn } from '../../lib/naturbank';
import { timeAgo } from '../../shared/naturbank/format';

export default function TransactionsCard({ txns }: { txns: Txn[] }) {
  return (
    <section className="card">
      <h3 className="h3">Transactions</h3>

      {txns.length === 0 ? (
        <p className="muted">No activity yet. Use the grant/spend buttons to simulate flow.</p>
      ) : (
        <div className="txn-table">
          <div className="txn-head">
            <div>Date</div><div>Type</div><div>Amount</div><div>Note</div>
          </div>
          {txns.map(t => (
            <div className="txn-row" key={t.id}>
              <div>{timeAgo(new Date(t.created_at).getTime())}</div>
              <div className={t.type === 'grant' ? 'pill blue' : 'pill red'}>
                {t.type === 'grant' ? 'Grant' : 'Spend'}
              </div>
              <div>{t.type === 'grant' ? `+${t.amount}` : `-${t.amount}`}</div>
              <div className="muted">{t.note || '—'}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

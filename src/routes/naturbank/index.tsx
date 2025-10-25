import { useEffect, useState } from 'react';
import { getBalance, getTxs, grantNatur, spendNatur } from '../../lib/naturbank/demo';
import SendPanel from '../../components/naturbank/SendPanel';

export default function NaturBank() {
  const [bal, setBal] = useState(getBalance());
  const [txs, setTxs] = useState(getTxs());

  const refresh = () => { setBal(getBalance()); setTxs(getTxs()); };

  // if you had effects to init state, keep them:
  useEffect(() => { refresh(); }, []);

  return (
    <main className="nb">
      <nav className="breadcrumbs">
        <a href="/">Home</a> <span>/</span> <span className="current">NaturBank</span>
      </nav>

      <h1 className="title">NaturBank</h1>
      <p className="muted center">Local demo mode.</p>

      <div className="grid">
        {/* LEFT: wallet actions */}
        <section>
          {/* your existing Wallet card + Save field remain unchanged */}

          <div className="btnrow" style={{ marginTop: 12 }}>
            <button onClick={()=>{ grantNatur(25); refresh(); }}>Grant +25 NATUR</button>
            <button onClick={()=>{ spendNatur(10); refresh(); }}>Spend −10 NATUR</button>
          </div>

          {/* NEW: Send card */}
          <div style={{ marginTop: 12 }}>
            <SendPanel onAfter={refresh} />
          </div>
        </section>

        {/* RIGHT: balance / transactions (unchanged except it reads bal/txs) */}
        <section>
          <div className="card">
            <h3>Balance</h3>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{bal} NATUR</div>
            <div style={{ opacity:.6, marginTop:6 }}>Starting demo balance: 120.<br/>Transactions apply on top.</div>
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <h3>Transactions</h3>
            {txs.length === 0 ? (
              <div style={{ opacity:.6 }}>No activity yet. Use the grant/spend/send buttons to simulate flow.</div>
            ) : (
              <table className="tx">
                <thead>
                  <tr><th>When</th><th>Type</th><th>Amount</th><th>Note</th></tr>
                </thead>
                <tbody>
                  {txs.map((t, i) => (
                    <tr key={i}>
                      <td>{new Date(t.when).toLocaleString()}</td>
                      <td style={{ color: t.type === 'spend' ? '#dc2626' : '#0ea5e9', fontWeight:700 }}>{t.type}</td>
                      <td style={{ fontWeight:700 }}>{t.amount > 0 ? `+${t.amount}` : t.amount}</td>
                      <td>{t.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

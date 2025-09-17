import { useEffect, useMemo, useState } from 'react';
import { addTx, balanceOf, loadWallet, saveWallet, NaturTx } from '@/lib/naturbank';
import { setTitle } from './_meta';
import './naturbank.css';

function useUserId() {
  const raw = localStorage.getItem('demo_user_id');
  if (raw) return raw;
  localStorage.setItem('demo_user_id', 'anon');
  return 'anon';
}

export default function NaturBankPage() {
  setTitle('NaturBank');
  const uid = useUserId();
  const [label, setLabel] = useState('My Wallet');
  const [address, setAddress] = useState('');
  const [starting, setStarting] = useState(120);
  const [txs, setTxs] = useState<NaturTx[]>([]);
  const [busy, setBusy] = useState<'save'|'grant'|'spend'|null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const w = loadWallet(uid, 120);
    setLabel(w.label);
    setAddress(w.address);
    setStarting(w.starting);
    setTxs(w.txs);
  }, [uid]);

  const balance = useMemo(() => balanceOf({ label, address, starting, txs }), [label, address, starting, txs]);

  function doSave() {
    setBusy('save');
    const w = saveWallet(uid, { label, address, starting, txs });
    setLabel(w.label);
    setAddress(w.address);
    setTxs(w.txs);
    setBusy(null);
    setStatus('Saved ✓');
    setTimeout(() => setStatus(''), 1500);
  }

  function grant(amount = 25) {
    setBusy('grant');
    const w = addTx(uid, { type: 'grant', amount, note: 'Daily grant' });
    setTxs(w.txs);
    setBusy(null);
  }

  function spend(amount = 10) {
    setBusy('spend');
    const w = addTx(uid, { type: 'spend', amount, note: 'Shop demo' });
    setTxs(w.txs);
    setBusy(null);
  }

  return (
    <div className="container">
      <nav className="bc">Home <span className="bc-divider">/</span> <span className="bc-current">NaturBank</span></nav>
      <h1 className="page-title">NaturBank</h1>
      <p className="muted">Local demo mode.</p>

      <section className="card">
        <h2>Wallet</h2>
        <div className="grid">
          <label>
            <div className="label">Label</div>
            <input value={label} onChange={e => setLabel(e.target.value)} />
          </label>
          <label>
            <div className="label">Address</div>
            <input placeholder="0x… or email handle" value={address} onChange={e => setAddress(e.target.value)} />
          </label>
        </div>

        <div className="row gap">
          <button disabled={!!busy} onClick={doSave}>Save</button>
          <button disabled={busy==='grant'} onClick={() => grant(25)}>Grant +25 NATUR</button>
          <button disabled={busy==='spend'} onClick={() => spend(10)}>Spend −10 NATUR</button>
          {status && <span className="status">{status}</span>}
        </div>
      </section>

      <section className="card center">
        <h3>Balance</h3>
        <div className="big">{balance} NATUR</div>
        <p className="muted">Starting demo balance: {starting}.<br/>Transactions apply on top.</p>
      </section>

      <section className="card">
        <h3>Transactions</h3>
        {txs.length === 0 ? (
          <p className="muted">No activity yet. Use the grant/spend buttons to simulate flow.</p>
        ) : (
          <div className="table">
            <div className="thead">
              <div>When</div><div>Type</div><div>Amount</div><div>Note</div>
            </div>
            {txs.map(t => (
              <div className="trow" key={t.id}>
                <div>{new Date(t.at).toLocaleString()}</div>
                <div className={t.type}>{t.type}</div>
                <div>{t.type === 'spend' ? `−${t.amount}` : `+${t.amount}`}</div>
                <div>{t.note || '—'}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

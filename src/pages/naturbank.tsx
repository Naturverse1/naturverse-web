import { useEffect, useMemo, useRef, useState } from 'react';
import {
  addRecent,
  addTx,
  balanceOf,
  copy,
  fmt,
  isValidHandleOrEmail,
  loadRecents,
  loadWallet,
  saveWallet,
  transferTo,
  normalizeWalletId,
} from '@/lib/naturbank';
import type { NaturTx, NaturTxType, RecentRecipient } from '@/lib/naturbank';
import { SHOP_ITEMS } from '@/lib/naturshop';
import { setTitle } from './_meta';
import './naturbank.css';

function useUserId() {
  const raw = localStorage.getItem('demo_user_id');
  const normalized = raw ? normalizeWalletId(raw) : '';
  const uid = normalized || 'anon';
  if (!raw || raw !== uid) {
    localStorage.setItem('demo_user_id', uid);
  }
  return uid;
}

export default function NaturBankPage() {
  setTitle('NaturBank');
  const uid = useUserId();
  const [label, setLabel] = useState('My Wallet');
  const [address, setAddress] = useState('');
  const [starting, setStarting] = useState(120);
  const [txs, setTxs] = useState<NaturTx[]>([]);
  const [filter, setFilter] = useState<'all' | NaturTxType>('all');
  const [busy, setBusy] = useState<'save' | 'grant' | 'spend' | 'send' | null>(null);
  const [status, setStatus] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('10');
  const [sendNote, setSendNote] = useState('');
  const [recents, setRecents] = useState<RecentRecipient[]>(() => loadRecents());
  const [sendAddrError, setSendAddrError] = useState('');
  const [sendAmountError, setSendAmountError] = useState('');
  const toastRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<number | null>(null);

  function showToast(message: string) {
    if (!toastRef.current) return;
    toastRef.current.textContent = message;
    toastRef.current.classList.add('show');
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => {
      toastRef.current?.classList.remove('show');
      toastTimer.current = null;
    }, 1500);
  }

  useEffect(() => () => {
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }
  }, []);

  useEffect(() => {
    const w = loadWallet(uid, 120);
    setLabel(w.label);
    setAddress(w.address);
    setStarting(w.starting);
    setTxs(w.txs);
  }, [uid]);

  const balance = useMemo(
    () => balanceOf({ label, address, starting, txs }),
    [label, address, starting, txs]
  );

  const filteredTxs = useMemo(() => {
    if (filter === 'all') return txs;
    return txs.filter(t => t.type === filter);
  }, [txs, filter]);

  const viewTotal = useMemo(
    () =>
      filteredTxs.reduce(
        (sum, t) => sum + (t.type === 'grant' ? t.amount : -t.amount),
        0
      ),
    [filteredTxs]
  );

  const viewTotalLabel = useMemo(() => {
    if (viewTotal === 0) return `+${fmt(0)}`;
    const formatted = fmt(Math.abs(viewTotal));
    return viewTotal > 0 ? `+${formatted}` : `-${formatted}`;
  }, [viewTotal]);

  function exportCsv() {
    const header = ['when', 'type', 'amount', 'note'];
    const rows = filteredTxs.map(t => {
      const signedAmount = t.type === 'grant' ? t.amount : -t.amount;
      return [
        new Date(t.at).toISOString(),
        t.type,
        String(signedAmount),
        (t.note ?? '').replace(/"/g, '""'),
      ];
    });
    const all = [header, ...rows]
      .map(cols => cols.map(c => (/[,"\n]/.test(c) ? `"${c}"` : c)).join(','))
      .join('\n');
    const blob = new Blob([all], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `naturbank_${filter}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    if (!sendTo.trim()) {
      setSendAddrError('');
      return;
    }
    setSendAddrError(isValidHandleOrEmail(sendTo) ? '' : 'Enter an email, @handle, or 0x… address');
  }, [sendTo]);

  useEffect(() => {
    if (!sendAmount.trim()) {
      setSendAmountError('Enter an amount');
      return;
    }
    const value = Number(sendAmount);
    if (Number.isNaN(value)) {
      setSendAmountError('Enter a number');
      return;
    }
    if (value <= 0) {
      setSendAmountError('Amount must be positive');
      return;
    }
    if (value > balance) {
      setSendAmountError('Insufficient balance');
      return;
    }
    setSendAmountError('');
  }, [sendAmount, balance]);

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

  function spend(amount = 10, note = 'Shop demo') {
    setBusy('spend');
    const w = addTx(uid, { type: 'spend', amount, note });
    setTxs(w.txs);
    setBusy(null);
  }

  function sendNatur() {
    const trimmedRecipient = sendTo.trim();
    if (!trimmedRecipient) {
      setSendAddrError('Enter an email, @handle, or 0x… address');
      showToast('Fix errors to continue');
      return;
    }

    const amountValue = Number(sendAmount);
    if (!Number.isFinite(amountValue)) {
      setSendAmountError('Enter a number');
      showToast('Fix errors to continue');
      return;
    }

    if (sendAddrError || sendAmountError) {
      showToast('Fix errors to continue');
      return;
    }

    setBusy('send');
    try {
      const { sender, recipientLabel } = transferTo({
        fromUid: uid,
        to: trimmedRecipient,
        amount: amountValue,
        note: sendNote,
        senderLabel: label,
      });
      setTxs(sender.txs);
      addRecent(trimmedRecipient);
      setRecents(loadRecents());
      setSendTo('');
      setSendAmount('10');
      setSendNote('');
      showToast(`Sent ${fmt(amountValue)} NATUR to ${recipientLabel}.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Transfer failed';
      const lower = message.toLowerCase();
      if (lower.includes('recipient') || lower.includes('yourself')) {
        setSendAddrError(message);
      } else if (lower.includes('amount') || lower.includes('balance')) {
        setSendAmountError(message);
      }
      showToast(message);
    } finally {
      setBusy(null);
    }
  }

  const disableSend = busy === 'send' || !!sendAddrError || !!sendAmountError || !sendTo.trim();

  return (
    <main className="nb-page">
      <header className="nb-header">
        <h1>NaturBank</h1>
        <p>Local demo mode.</p>
      </header>

      <section className="nb-section" aria-labelledby="wallet-title">
        <h2 id="wallet-title">Wallet</h2>

        <div className="nb-wallet-grid">
          <div className="nb-field">
            <label htmlFor="nb-label">Label</label>
            <input id="nb-label" value={label} onChange={e => setLabel(e.target.value)} />
          </div>
          <div className="nb-field">
            <label htmlFor="nb-address">Address</label>
            <input
              id="nb-address"
              placeholder="0x… or email handle"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="nb-actions" style={{ marginTop: 12 }}>
          <button className="btn" disabled={!!busy} onClick={doSave}>
            Save
          </button>
          <button className="btn" disabled={busy === 'grant'} onClick={() => grant(25)}>
            Grant +25 NATUR
          </button>
          <button className="btn" disabled={busy === 'spend'} onClick={() => spend(10, 'Shop demo')}>
            Spend −10 NATUR
          </button>
          {status && <span className="nb-status">{status}</span>}
        </div>

        <div className="nb-send" aria-labelledby="send-title">
          <div className="nb-send-head">
            <h3 id="send-title">Send</h3>
            <button
              type="button"
              className="nb-copy"
              onClick={async () => {
                const trimmed = address.trim();
                if (!trimmed) {
                  showToast('Add an address first');
                  return;
                }
                const ok = await copy(trimmed);
                showToast(ok ? 'Address copied' : 'Copy failed');
              }}
            >
              Copy my address
            </button>
          </div>

          <div className="nb-send-grid">
            <div className="nb-field">
              <label htmlFor="nb-recipient">Recipient</label>
              <input
                id="nb-recipient"
                placeholder="Email or @handle"
                value={sendTo}
                onChange={e => setSendTo(e.target.value)}
                aria-invalid={sendAddrError ? 'true' : 'false'}
                aria-describedby={sendAddrError ? 'nb-recipient-error' : undefined}
              />
              {sendAddrError && (
                <p id="nb-recipient-error" className="nb-error" role="alert">
                  {sendAddrError}
                </p>
              )}
            </div>
            <div className="nb-field">
              <label htmlFor="nb-amount">Amount</label>
              <input
                id="nb-amount"
                type="number"
                inputMode="decimal"
                value={sendAmount}
                onChange={e => setSendAmount(e.target.value)}
                aria-invalid={sendAmountError ? 'true' : 'false'}
                aria-describedby={sendAmountError ? 'nb-amount-error' : undefined}
              />
              {sendAmountError && (
                <p id="nb-amount-error" className="nb-error" role="alert">
                  {sendAmountError}
                </p>
              )}
            </div>
            <div className="nb-field nb-send-note">
              <label htmlFor="nb-note">Note (optional)</label>
              <input
                id="nb-note"
                placeholder="What's this for?"
                value={sendNote}
                onChange={e => setSendNote(e.target.value)}
              />
            </div>
          </div>

          {!!recents.length && (
            <div className="nb-recents" aria-label="Recent recipients">
              <span className="nb-recents-label">Recent:</span>
              {recents.map(r => (
                <button
                  type="button"
                  className="nb-recent"
                  key={r.id}
                  onClick={() => setSendTo(r.id)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}

          <div className="nb-send-actions">
            <button
              type="button"
              className="btn"
              disabled={disableSend}
              aria-disabled={disableSend}
              onClick={sendNatur}
            >
              {busy === 'send' ? (
                <>
                  <span className="spinner" aria-hidden="true" /> Sending…
                </>
              ) : (
                'Send NATUR'
              )}
            </button>
            <small className="nb-balance-note">Balance: {fmt(balance)} NATUR</small>
          </div>
        </div>
      </section>

      <section className="nb-section" aria-labelledby="nb-shop-title">
        <h2 id="nb-shop-title">Shop</h2>
        <div className="nb-shop">
          {SHOP_ITEMS.map(item => {
            const insufficient = balance < item.price;
            const disabled = busy === 'spend' || insufficient;
            const tooltip = disabled
              ? insufficient
                ? 'Insufficient balance'
                : 'Processing purchase'
              : `Buy ${item.name}`;
            return (
              <div className="nb-item" key={item.id} aria-label={`${item.name} card`}>
                <div className="nb-item-emoji" aria-hidden="true">
                  {item.emoji}
                </div>
                <h4>{item.name}</h4>
                {item.blurb && <p>{item.blurb}</p>}
                <p className="nb-item-price">{fmt(item.price)} NATUR</p>
                <button
                  className="btn"
                  onClick={() => spend(item.price, item.name)}
                  disabled={disabled}
                  aria-disabled={disabled}
                  title={tooltip}
                >
                  Buy
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="nb-section nb-balance" aria-labelledby="balance-title">
        <h2 id="balance-title">Balance</h2>
        <div className="amount">{fmt(balance)} NATUR</div>
        <small>Starting demo balance: {fmt(starting)}. Transactions apply on top.</small>
      </section>

      <section className="nb-section" aria-labelledby="tx-title">
        <div className="nb-pills" role="tablist" aria-label="Filter transactions">
          {(['all', 'grant', 'spend', 'send'] as const).map(key => (
            <button
              key={key}
              role="tab"
              aria-selected={filter === key}
              className={`nb-pill${filter === key ? ' is-active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {key[0].toUpperCase() + key.slice(1)}
            </button>
          ))}
          <div className="nb-total">Total (view): {viewTotalLabel} NATUR</div>
        </div>

        <button className="btn nb-export" onClick={exportCsv}>
          Export CSV
        </button>

        <h2 id="tx-title" style={{ marginTop: 14 }}>
          Transactions
        </h2>
        <table className="nb-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {txs.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  No activity yet. Use the grant, spend, or send actions to simulate flow.
                </td>
              </tr>
            ) : filteredTxs.length === 0 ? (
              <tr>
                <td colSpan={4}>No transactions match this filter.</td>
              </tr>
            ) : (
              filteredTxs.map(t => (
                <tr key={t.id}>
                  <td>{new Date(t.at).toLocaleString()}</td>
                  <td className={`nb-type--${t.type}`}>{t.type}</td>
                  <td>{t.type === 'grant' ? `+${fmt(t.amount)}` : `-${fmt(t.amount)}`}</td>
                  <td>{t.note || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
      <div ref={toastRef} className="toast" role="status" aria-live="polite" />
    </main>
  );
}

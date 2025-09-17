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
import type { NaturTx, RecentRecipient } from '@/lib/naturbank';
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

  const balance = useMemo(() => balanceOf({ label, address, starting, txs }), [label, address, starting, txs]);

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

        <div className="send-panel">
          <h3>Send</h3>
          <label>
            <div className="label">Recipient</div>
            <input
              placeholder="Email or @handle"
              value={sendTo}
              onChange={e => setSendTo(e.target.value)}
            />
          </label>
          {sendAddrError && <div className="nb-inline" role="alert">{sendAddrError}</div>}
          {!!recents.length && (
            <div className="nb-chips" aria-label="Recent recipients">
              {recents.map(r => (
                <button
                  type="button"
                  className="nb-chip"
                  key={r.id}
                  onClick={() => setSendTo(r.id)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
          <label>
            <div className="label">Amount</div>
            <input
              type="number"
              inputMode="decimal"
              value={sendAmount}
              onChange={e => setSendAmount(e.target.value)}
            />
          </label>
          {sendAmountError && <div className="nb-inline" role="alert">{sendAmountError}</div>}
          <label className="send-note">
            <div className="label">Note (optional)</div>
            <input
              placeholder="What's this for?"
              value={sendNote}
              onChange={e => setSendNote(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="send-btn"
            disabled={disableSend}
            aria-disabled={disableSend}
            onClick={sendNatur}
          >
            {busy === 'send' ? (
              <>
                <span className="spinner" aria-hidden /> Sending…
              </>
            ) : 'Send NATUR'}
          </button>
          <div className="nb-tools">
            <button
              type="button"
              className="nb-chip"
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
            <small style={{ opacity: 0.7 }}>Balance: {fmt(balance)} NATUR</small>
          </div>
        </div>
      </section>

      <section className="card" aria-labelledby="nb-shop-title">
        <h3 id="nb-shop-title" style={{ marginTop: 0 }}>Shop</h3>
        <p style={{ marginTop: '-.25rem', opacity: 0.75 }}>
          Spend NATUR on small items to simulate purchases.
        </p>
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
              <div className="nb-card" key={item.id} aria-label={`${item.name} card`}>
                <div className="nb-item-emoji" aria-hidden="true">{item.emoji}</div>
                <div className="nb-item-name">{item.name}</div>
                {item.blurb && <div className="nb-item-blurb">{item.blurb}</div>}
                <div className="nb-item-price">{fmt(item.price)} NATUR</div>
                <button
                  className="nb-buy"
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

      <section className="card center">
        <h3>Balance</h3>
        <div className="big">{fmt(balance)} NATUR</div>
        <p className="muted">Starting demo balance: {starting}.<br/>Transactions apply on top.</p>
      </section>

      <section className="card">
        <h3>Transactions</h3>
        {txs.length === 0 ? (
          <p className="muted">No activity yet. Use the grant, spend, or send actions to simulate flow.</p>
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
      <div ref={toastRef} className="toast" role="status" aria-live="polite" />
    </div>
  );
}

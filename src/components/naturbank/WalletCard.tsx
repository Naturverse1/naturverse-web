import React, { useState } from 'react';
import type { Wallet } from '../../lib/naturbank';

type Props = {
  wallet: Wallet;
  onSave: (fields: { label: string; address: string }) => void;
  onGrant: (note?: string) => void;
  onSpend: (note?: string) => void;
};

export default function WalletCard({ wallet, onSave, onGrant, onSpend }: Props) {
  const [label, setLabel] = useState(wallet.label);
  const [addr, setAddr] = useState(wallet.address ?? '');
  const [note, setNote] = useState('');

  return (
    <section className="card">
      <h3 className="h3">Wallet</h3>
      <div className="row">
        <div className="col">
          <label className="lbl">Label</label>
          <input className="inp" value={label} onChange={e => setLabel(e.target.value)} />
        </div>
        <div className="col">
          <label className="lbl">Address</label>
          <input
            className="inp"
            placeholder="Email or @handle"
            value={addr}
            onChange={e => setAddr(e.target.value)}
          />
        </div>
      </div>
      <div className="row gap wallet-actions">
        <input
          className="inp"
          placeholder="Note (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <button className="btn" onClick={() => onSave({ label, address: addr })}>Save</button>
        <button
          className="btn btn-primary"
          onClick={() => {
            onGrant(note);
            setNote('');
          }}
        >
          Grant +25 NATUR
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            onSpend(note);
            setNote('');
          }}
        >
          Spend −10 NATUR
        </button>
      </div>
      <p className="hint">Local demo mode.</p>
    </section>
  );
}

import React, { useState } from 'react';
import { NaturWallet } from '../../shared/naturbank/types';

type Props = {
  wallet: NaturWallet;
  onSave: (next: NaturWallet) => void;
  onGrant: () => void;
  onSpend: () => void;
};

export default function WalletCard({ wallet, onSave, onGrant, onSpend }: Props) {
  const [label, setLabel] = useState(wallet.label);
  const [addr, setAddr] = useState(wallet.address);

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
          <input className="inp" placeholder="0x… or email handle" value={addr} onChange={e => setAddr(e.target.value)} />
        </div>
      </div>
      <div className="row gap">
        <button className="btn" onClick={() => onSave({ label, address: addr })}>Save</button>
        <button className="btn btn-primary" onClick={onGrant}>Grant +25 NATUR</button>
        <button className="btn btn-danger" onClick={onSpend}>Spend −10 NATUR</button>
      </div>
      <p className="hint">Local demo mode.</p>
    </section>
  );
}

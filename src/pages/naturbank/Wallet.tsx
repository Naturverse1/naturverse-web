import React, { useState } from "react";
import { createDemoWallet, getWallet, getBalance } from "../../lib/naturbank/store";

export default function Wallet() {
  const [w, setW] = useState(getWallet());
  const [bal, setBal] = useState(getBalance());

  const create = () => { const nw = createDemoWallet(); setW(nw); setBal(getBalance()); };

  return (
    <main id="main" className="page-wrap">
      <h1>🪪 Wallet</h1>
      {!w ? (
        <div className="panel">
          <p>Create a demo custodial wallet to preview features.</p>
          <button className="btn" onClick={create}>Create Wallet (demo)</button>
        </div>
      ) : (
        <div className="panel">
          <div className="row">
            <div className="grow">
              <div className="muted">Address</div>
              <div className="mono">{w.address}</div>
            </div>
            <div className="stat">
              <div className="muted">Balance</div>
              <div className="big">💚 {bal} NATUR</div>
            </div>
          </div>
          <div className="meta">Created: {new Date(w.createdAt).toLocaleString()}</div>
        </div>
      )}
      <p className="meta">Real wallet connect arrives later.</p>
    </main>
  );
}

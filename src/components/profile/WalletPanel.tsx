import React from "react";
import { useWallet } from "../../hooks/useWallet";

export default function WalletPanel() {
  const { wallet, loading, earn, spend } = useWallet();
  return (
    <section className="panel">
      <h2>NATUR Wallet</h2>
      <p className="big">{loading ? "…" : `${wallet?.balance ?? 0} NATUR`}</p>
      <div className="row">
        <button className="btn tiny" onClick={() => earn(5, { reason: "demo" })}>+5</button>
        <button className="btn tiny" onClick={() => spend(2, { reason: "demo" })}>−2</button>
      </div>
    </section>
  );
}

import React, { useMemo, useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import { getLedger, addTx, getBalance } from "../../lib/naturbank/store";
import type { Tx } from "../../lib/naturbank/types";

function newId() { return Math.random().toString(36).slice(2, 10); }

export default function Token() {
  const [ledger, setLedger] = useState(getLedger());
  const [bal, setBal] = useState(getBalance());
  const [memo, setMemo] = useState("");

  const earned = useMemo(() => ledger.filter(t => t.type !== "spend").reduce((a,b)=>a+b.amount,0), [ledger]);
  const spent  = useMemo(() => ledger.filter(t => t.type === "spend").reduce((a,b)=>a+b.amount,0), [ledger]);

  const quick = (t: Tx["type"], amt: number, m: string) => {
    addTx({ id: newId(), ts: Date.now(), type: t, amount: amt, memo: m });
    setLedger(getLedger()); setBal(getBalance()); setMemo("");
  };

  return (
    <main id="main" data-page="naturbank" className="nvrs-section naturbank page-wrap">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/naturbank", label: "NaturBank" }, { label: "Token" }]} />
      <h1>🪙 NATUR Token</h1>

      <div className="panel">
        <div className="row">
          <div className="stat"><div className="muted">Balance</div><div className="big">💚 {bal}</div></div>
          <div className="stat"><div className="muted">Earned</div><div className="big">+{earned}</div></div>
          <div className="stat"><div className="muted">Spent</div><div className="big">−{spent}</div></div>
          <div className="spacer" />
          <button className="btn tiny" onClick={()=>quick("earn", 5, "Daily check-in")}>+5</button>
          <button className="btn tiny" onClick={()=>quick("spend", 5, "Sample spend")}>−5</button>
        </div>

        <div className="row">
          <input className="input" placeholder="Memo…" value={memo} onChange={e=>setMemo(e.target.value)} />
          <button className="btn tiny outline" onClick={()=>quick("earn", 10, memo || "Custom earn")}>Earn 10</button>
          <button className="btn tiny outline" onClick={()=>quick("spend", 10, memo || "Custom spend")}>Spend 10</button>
        </div>
      </div>

      <h2 className="mt">Ledger</h2>
      <div className="ledger">
        {ledger.map(t => (
          <div key={t.id} className="line">
            <div className="mono">{new Date(t.ts).toLocaleString()}</div>
            <div className={"pill " + (t.type === "spend" ? "red" : "green")}>
              {t.type === "spend" ? "−" : "+"}{t.amount}
            </div>
            <div className="grow">{t.memo}</div>
          </div>
        ))}
      </div>

      <p className="meta">Redemptions & real transactions connect here later.</p>
    </main>
  );
}

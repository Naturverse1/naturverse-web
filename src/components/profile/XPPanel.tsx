import React from "react";
import { useXP } from "../../hooks/useXP";

export default function XPPanel() {
  const { xp, loading, addXP } = useXP();
  return (
    <section className="panel">
      <h2>Experience (XP)</h2>
      <p className="big">{loading ? "…" : `${xp} XP`}</p>
      <div className="row">
        <button className="btn tiny" onClick={() => addXP(10, "demo")}>+10 XP</button>
      </div>
    </section>
  );
}

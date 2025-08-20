import { useEffect, useState } from "react";
import { getDeviceId } from "../lib/device";

export default function TokenBalance() {
  const [balance, setBalance] = useState<number | null>(null);
  const dev = getDeviceId();

  async function refresh() {
    const r = await fetch(`/.netlify/functions/tokens?device=${dev}`);
    const d = await r.json();
    setBalance(d.balance);
  }

  useEffect(()=>{ refresh(); }, []);
  return <span>Balance: <strong>{balance ?? "…"}</strong> NATUR</span>;
}


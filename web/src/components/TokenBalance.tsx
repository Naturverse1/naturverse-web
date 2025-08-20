import { useEffect, useState } from "react";
import { getDeviceId } from "../lib/device";
export default function TokenBalance() {
  const [bal, setBal] = useState<number | null>(null);
  useEffect(() => {
    const dev = getDeviceId();
    fetch(`/.netlify/functions/tokens?device=${dev}`).then(r=>r.json()).then(d=>setBal(d.balance));
  }, []);
  return <span>Balance: <strong>{bal ?? "…"}</strong> NATUR</span>;
}

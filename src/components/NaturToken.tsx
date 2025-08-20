import { useEffect, useState } from "react";

export default function NaturToken(){
  const [balance, setBalance] = useState<number | null>(null);
  useEffect(()=>{
    const rpc = import.meta.env.VITE_ALCHEMY_RPC_URL;
    const token = import.meta.env.VITE_NATUR_TOKEN_ADDRESS;
    const addr = "0x000000000000000000000000000000000000dEaD"; // demo address
    async function fetchBalance(){
      try {
        if (!(rpc && token)) return setBalance(0);
        const data = {
          jsonrpc:"2.0", id:1, method:"alchemy_getTokenBalances",
          params:[addr, [token]]
        };
        const res = await fetch(rpc, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(data) });
        const json = await res.json();
        const raw = json?.result?.tokenBalances?.[0]?.tokenBalance || "0x0";
        setBalance(parseInt(raw, 16) / 1e18);
      } catch { setBalance(0); }
    }
    fetchBalance();
  },[]);
  return <div className="muted">Natur Token: <strong>{balance ?? "…"}</strong></div>;
}

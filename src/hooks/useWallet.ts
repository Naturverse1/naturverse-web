import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Wallet = { balance: number };

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const { data } = await supabase.from("v_my_wallet").select("*").single();
    setWallet((data as Wallet) || { balance: 0 });
    return data;
  }

  useEffect(() => {
    (async () => {
      try { await refresh(); } finally { setLoading(false); }
    })();
  }, []);

  async function earn(amount: number, meta: object = {}) {
    await supabase.rpc("earn_spend_natur", { p_kind: "earn", p_amount: amount, p_meta: meta });
    return refresh();
  }

  async function spend(amount: number, meta: object = {}) {
    await supabase.rpc("earn_spend_natur", { p_kind: "spend", p_amount: amount, p_meta: meta });
    return refresh();
  }

  return { wallet, loading, earn, spend, refresh };
}

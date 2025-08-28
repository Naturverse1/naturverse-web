import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/useSupabase";

type Wallet = { balance: number };

export function useWallet() {
  const supabase = useSupabase();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    if (!supabase) return null;
    const { data } = await supabase.from("v_my_wallet").select("*").single();
    setWallet((data as Wallet) || { balance: 0 });
    return data;
  }

  useEffect(() => {
    (async () => {
      try { await refresh(); } finally { setLoading(false); }
    })();
  }, [supabase]);

  async function earn(amount: number, meta: object = {}) {
    if (!supabase) return null;
    await supabase.rpc("earn_spend_natur", { p_kind: "earn", p_amount: amount, p_meta: meta });
    return refresh();
  }

  async function spend(amount: number, meta: object = {}) {
    if (!supabase) return null;
    await supabase.rpc("earn_spend_natur", { p_kind: "spend", p_amount: amount, p_meta: meta });
    return refresh();
  }

  return { wallet, loading, earn, spend, refresh };
}

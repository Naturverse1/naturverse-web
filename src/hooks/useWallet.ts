import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useWallet() {
  const [wallet, setWallet] = useState<{ balance: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWallet() {
      const { data, error } = await supabase
        .from("v_my_wallet")
        .select("*")
        .single();
      if (error) console.error(error);
      setWallet(data);
      setLoading(false);
    }
    fetchWallet();
  }, []);

  async function earn(amount: number, meta: object = {}) {
    await supabase.rpc("earn_spend_natur", { p_kind: "earn", p_amount: amount, p_meta: meta });
    return await refresh();
  }

  async function spend(amount: number, meta: object = {}) {
    await supabase.rpc("earn_spend_natur", { p_kind: "spend", p_amount: amount, p_meta: meta });
    return await refresh();
  }

  async function refresh() {
    const { data } = await supabase.from("v_my_wallet").select("*").single();
    setWallet(data);
    return data;
  }

  return { wallet, loading, earn, spend, refresh };
}

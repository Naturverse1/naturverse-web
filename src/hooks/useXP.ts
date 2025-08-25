import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

export function useXP() {
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes.user?.id;
      if (!userId) { setXp(0); setLoading(false); return; }

      const { data, error } = await supabase
        .from("xp_ledger")
        .select("delta")
        .eq("user_id", userId);

      if (!error) {
        const total = (data || []).reduce((a, r) => a + (r?.delta || 0), 0);
        setXp(total);
      }
      setLoading(false);
    })();
  }, []);

  async function addXP(delta: number, source = "manual") {
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes.user?.id;
    if (!userId) return;
    await supabase.from("xp_ledger").insert({ user_id: userId, delta, source });
    setXp((v) => v + delta);
  }

  return { xp, loading, addXP };
}

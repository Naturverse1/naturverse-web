import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/useSupabase";

export function useXP() {
  const supabase = useSupabase();
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!supabase) { setXp(0); setLoading(false); return; }
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
  }, [supabase]);

  async function addXP(delta: number, source = "manual") {
    if (!supabase) return;
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes.user?.id;
    if (!userId) return;
    await supabase.from("xp_ledger").insert({ user_id: userId, delta, source });
    setXp((v) => v + delta);
  }

  return { xp, loading, addXP };
}

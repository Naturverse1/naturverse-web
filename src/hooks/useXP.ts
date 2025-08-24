import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useXP() {
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchXP() {
      const { data, error } = await supabase
        .from("xp_ledger")
        .select("delta")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) console.error(error);

      const total = data?.reduce((acc, row) => acc + row.delta, 0) ?? 0;
      setXp(total);
      setLoading(false);
    }
    fetchXP();
  }, []);

  async function addXP(delta: number, source = "manual") {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;
    await supabase.from("xp_ledger").insert({ user_id: user.id, delta, source });
    setXp((prev) => prev + delta);
  }

  return { xp, loading, addXP };
}

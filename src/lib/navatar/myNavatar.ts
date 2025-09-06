import type { Navatar } from "./types";
import { getCurrent, setCurrent } from "./store";
import { useSupabase } from "../useSupabase";

export async function fetchMyNavatar(userId?: string, supabase?: ReturnType<typeof useSupabase>): Promise<Navatar | null> {
  // 1) Supabase (preferred, if table exists)
  try {
    if (userId && supabase) {
      const { data, error } = await supabase
        .from("avatars") // your approved table name from schema
        .select("id,name,image_url,category")
        .eq("user_id", userId).order("created_at", { ascending: false }).limit(1);
      if (!error && data && data[0]) {
        const nav: Navatar = {
          id: data[0].id,
          name: data[0].name || "My Navatar",
          base: data[0].category || "Spirit",
          img: data[0].image_url || undefined,
          rarity: "Common",
          priceCents: 0,
        };
        setCurrent(nav);
        return nav;
      }
    }
  } catch {}
  // 2) Local fallback
  return getCurrent();
}

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getUserId } from "../lib/session";
import type { CloudProfile, LocalProfile } from "../types/profile";

export function useCloudProfile() {
  const [userId, setUserId] = useState<string | null>(null);
  const [cloud, setCloud] = useState<CloudProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const id = await getUserId();
      setUserId(id);
      if (!id) { setCloud(null); setLoading(false); return; }
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
      if (!error) setCloud(data as CloudProfile);
      setLoading(false);
    })();
  }, []);

  const saveFromLocal = useCallback(
    async (local: LocalProfile, avatar_url?: string | null) => {
      const id = userId ?? (await getUserId());
      if (!id) return { error: "no-user" } as const;
      const payload: Partial<CloudProfile> = {
        id,
        display_name: local.displayName || null,
        email: local.email || null,
        kid_safe_chat: !!local.kidSafeChat,
        theme: local.theme,
        newsletter: !!local.newsletter,
        avatar_url: avatar_url ?? null,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" }).select().single();
      if (!error) setCloud(data as CloudProfile);
      return { data, error } as const;
    },
    [userId]
  );

  return { userId, cloud, loading, saveFromLocal };
}

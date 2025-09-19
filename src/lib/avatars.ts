import { supabase } from "./supabase-client";

export type NavatarRow = {
  id: string;
  owner_id: string;
  name: string | null;
  image_url: string | null;
  metadata?: any | null;
  is_primary?: boolean | null;
};

export async function getMyNavatar(userId: string) {
  return supabase
    .from("navatars")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle<NavatarRow>();
}

// Pick/Set current navatar image + optional name (single row per user)
export async function upsertMyNavatar(userId: string, fields: Partial<NavatarRow>) {
  const payload = {
    owner_id: userId,
    is_primary: true,
    ...fields,
  };
  return supabase
    .from("navatars")
    .upsert(payload, { onConflict: "owner_id" })
    .select()
    .maybeSingle<NavatarRow>();
}


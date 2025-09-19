import { supabase } from "./supabaseClient";

export type AvatarRow = {
  id: string;
  user_id: string;
  name: string | null;
  image_url: string | null;
  appearance_data?: any | null;
  is_primary?: boolean | null;
};

export async function getMyAvatar(userId: string) {
  return supabase
    .from("avatars")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle<AvatarRow>();
}

// Pick/Set current avatar image + optional name (single row per user)
export async function upsertMyAvatar(userId: string, fields: Partial<AvatarRow>) {
  const payload = {
    user_id: userId,
    is_primary: true,
    ...fields,
  };
  return supabase
    .from("avatars")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .maybeSingle<AvatarRow>();
}


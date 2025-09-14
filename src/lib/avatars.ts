import { supabase } from "./supabase-client";

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

// Character Card (stored in character_cards, linked by avatar_id)
export async function saveCharacterCard(params: {
  userId: string;
  avatarId: string;
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  powers?: string[];
  traits?: string[];
}) {
  const { userId, avatarId, ...card } = params;
  return supabase
    .from("character_cards")
    .upsert(
      [{ user_id: userId, avatar_id: avatarId, ...card }],
      { onConflict: "avatar_id" }
    )
    .select()
    .maybeSingle();
}

export async function getCharacterCard(avatarId: string) {
  return supabase
    .from("character_cards")
    .select("*")
    .eq("avatar_id", avatarId)
    .maybeSingle();
}


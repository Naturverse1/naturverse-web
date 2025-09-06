import { supabase } from "./supabase-client";

export type CharacterCard = {
  id?: string;
  user_id?: string;
  navatar_id: string;
  name?: string | null;
  species?: string | null;
  kingdom?: string | null;
  backstory?: string | null;
  powers?: string[] | null;
  traits?: string[] | null;
  updated_at?: string;
};

export function splitList(s?: string) {
  if (!s) return [];
  return s.split(",").map(x => x.trim()).filter(Boolean);
}

export async function loadPrimaryNavatarId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("avatars")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_primary", true)
    .maybeSingle();

  if (error) throw error;
  return data?.id ?? null;
}

export async function getCard(navatarId: string): Promise<CharacterCard | null> {
  const { data, error } = await supabase
    .from("character_cards")
    .select("*")
    .eq("navatar_id", navatarId)
    .maybeSingle();
  if (error && (error as any).code !== "PGRST116") throw error;
  return data ?? null;
}

export async function upsertCard(userId: string, input: CharacterCard) {
  const payload = { ...input, user_id: userId };
  const { data, error } = await supabase
    .from("character_cards")
    .upsert(payload, { onConflict: "user_id,navatar_id" })
    .select()
    .single();
  if (error) throw error;
  return data as CharacterCard;
}

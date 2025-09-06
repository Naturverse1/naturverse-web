import { supabase } from "./supabase-client";

export type NavatarCard = {
  navatar_id: string;
  name?: string | null;
  species?: string | null;
  kingdom?: string | null;
  backstory?: string | null;
  powers?: string[] | null;
  traits?: string[] | null;
  updated_at?: string;
};

export async function loadPrimaryNavatarId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("navatars")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_primary", true)
    .maybeSingle();

  if (error) throw error;
  return data?.id ?? null;
}

export async function loadCard(navatar_id: string): Promise<NavatarCard | null> {
  const { data, error } = await supabase
    .from("navatar_cards")
    .select("*")
    .eq("navatar_id", navatar_id)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function saveCard(input: NavatarCard) {
  const { data, error } = await supabase
    .from("navatar_cards")
    .upsert(input, { onConflict: "navatar_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data as NavatarCard;
}

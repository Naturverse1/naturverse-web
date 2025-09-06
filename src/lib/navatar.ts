import { supabase } from "./supabase-client";
import type { CharacterCard } from "./types";

export type NavatarRow = {
  id: string;
  user_id: string;
  name: string | null;
  base_type: string;          // 'Animal' | 'Fruit' | 'Insect' | 'Spirit'
  backstory: string | null;
  image_path: string | null;  // storage key inside the 'avatars' bucket
  created_at: string;
  updated_at: string;
};

export function navatarImageUrl(image_path: string | null) {
  if (!image_path) return null;
  // bucket is 'avatars'
  const { data } = supabase.storage.from("avatars").getPublicUrl(image_path);
  return data?.publicUrl ?? null;
}

export async function listMyNavatars() {
  const { data: { user }, error: uErr } = await supabase.auth.getUser();
  if (uErr || !user) throw new Error("Not signed in");
  const { data, error } = await supabase
    .from("avatars")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as NavatarRow[];
}

export async function saveNavatar(opts: {
  name?: string;
  base_type: "Animal" | "Fruit" | "Insect" | "Spirit";
  backstory?: string;
  file?: File | null;
}) {
  const { data: { user }, error: uErr } = await supabase.auth.getUser();
  if (uErr || !user) throw new Error("Not signed in");

  let image_path: string | null = null;

  if (opts.file) {
    // create a deterministic file path
    const ext = opts.file.name.split(".").pop() || "png";
    const fileName = `${crypto.randomUUID()}.${ext}`;
    image_path = `navatars/${user.id}/${fileName}`;
    const { error: upErr } = await supabase
      .storage.from("avatars")
      .upload(image_path, opts.file, { upsert: false });
    if (upErr) throw upErr;
  }

  const { data, error } = await supabase
    .from("avatars")
    .insert([{ 
      name: opts.name ?? null,
      base_type: opts.base_type,
      backstory: opts.backstory ?? null,
      image_path,
    }])
    .select()
    .single();

  if (error) throw error;
  return data as NavatarRow;
}

export async function getSessionUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function fetchMyCharacterCard(): Promise<CharacterCard | null> {
  const user = await getSessionUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("character_cards")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error && (error as any).code !== "PGRST116") throw error;
  return (data as CharacterCard) ?? null;
}

export async function getActiveNavatar(userId: string) {
  return supabase
    .from("avatars")
    .select("id, name, image_url")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single();
}

export async function upsertCharacterCard(payload: {
  user_id: string;
  avatar_id: string;
  name: string;
  species: string;
  kingdom: string;
  backstory?: string;
  powers?: string[];
  traits?: string[];
}) {
  return supabase
    .from("character_cards")
    .upsert(
      { ...payload, updated_at: new Date().toISOString() },
      { onConflict: "user_id,avatar_id" }
    )
    .select()
    .single();
}

export async function getCardForAvatar(avatarId: string) {
  return supabase
    .from("character_cards")
    .select("*")
    .eq("avatar_id", avatarId)
    .single();
}


export async function getActiveNavatarWithCard(userId: string) {
  const { data: active } = await supabase
    .from("avatars")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();

  if (!active) return { avatar: null, card: null };

  const { data: card } = await supabase
    .from("character_cards")
    .select("*")
    .eq("avatar_id", active.id)
    .maybeSingle();

  return { avatar: active, card: (card as unknown as CharacterCard) ?? null };
}

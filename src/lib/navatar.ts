import { supabase } from "./supabase-client";
import type { SupabaseClient } from "@supabase/supabase-js";

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

export async function getActiveNavatarId(
  sb: SupabaseClient
): Promise<string | null> {
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const { data: profile } = await sb
    .from("profiles")
    .select("current_avatar_id")
    .eq("id", user.id)
    .single();

  if (profile?.current_avatar_id) return profile.current_avatar_id;

  const { data: latest } = await sb
    .from("avatars")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latest?.id) return null;

  await setActiveNavatarId(sb, latest.id);
  return latest.id;
}

export async function setActiveNavatarId(
  sb: SupabaseClient,
  id: string
) {
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("No user");

  await sb.from("profiles").update({ current_avatar_id: id }).eq("id", user.id);
}

export type CardInput = {
  avatar_id: string;
  name?: string;
  base_type?: string;
  kingdom?: string;
  backstory?: string;
  powers?: string[];
  traits?: string[];
};

export async function upsertCharacterCard(
  sb: SupabaseClient,
  input: CardInput
) {
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("No user");

  const payload = { ...input, user_id: user.id };
  const { error } = await sb
    .from("character_cards")
    .upsert(payload, { onConflict: "user_id,avatar_id" });
  if (error) throw error;
}

export async function getCharacterCard(
  sb: SupabaseClient,
  avatar_id: string
) {
  const { data } = await sb
    .from("character_cards")
    .select("*")
    .eq("avatar_id", avatar_id)
    .maybeSingle();
  return data ?? null;
}


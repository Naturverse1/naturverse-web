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

export type ActiveNavatar = {
  id: string;
  slug?: string | null;
  title?: string | null;
  image_url?: string | null;
};

const LS_KEY = "active_navatar";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function loadActive(): ActiveNavatar | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveActiveFromRow(row: {
  id: string;
  slug?: string | null;
  name?: string | null;
  title?: string | null;
  image_url?: string | null;
}) {
  const active: ActiveNavatar = {
    id: row.id,
    slug: row.slug ?? null,
    title: row.title ?? row.name ?? null,
    image_url: row.image_url ?? null,
  };
  localStorage.setItem(LS_KEY, JSON.stringify(active));
}

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

export type CharacterCard = {
  name?: string | null;
  species?: string | null;
  kingdom?: string | null;
  backstory?: string | null;
  powers?: string[];
  traits?: string[];
};

export async function fetchMyCharacterCard(
  client: SupabaseClient
): Promise<CharacterCard | null> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;

  const active = loadActive();
  if (!active?.id) return null;

  let avatar_id = active.id;
  if (!UUID_RE.test(avatar_id)) return null;

  const { data, error } = await client
    .from("character_cards")
    .select("*")
    .eq("user_id", user.id)
    .eq("avatar_id", avatar_id)
    .maybeSingle();

  if (error) throw error;
  return (data as any) ?? null;
}

export async function getActiveNavatar(userId: string) {
  return supabase
    .from("avatars")
    .select("id, name, image_url")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single();
}

export async function upsertCharacterCard(
  client: SupabaseClient,
  fields: CharacterCard
) {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const active = loadActive();
  if (!active?.id) throw new Error("Please pick a Navatar first.");

  let avatar_id = active.id;
  if (!UUID_RE.test(avatar_id)) {
    let q = client.from("avatars").select("id").limit(1);
    if (active.slug) {
      q = q.eq("slug", active.slug);
    } else if (active.title) {
      q = q.eq("name", active.title);
    }
    const { data: found, error: findErr } = await q.maybeSingle();
    if (findErr) throw findErr;
    if (!found?.id) throw new Error("Active Navatar is not valid.");
    avatar_id = found.id;
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ ...active, id: avatar_id })
    );
  }

  const payload = {
    user_id: user.id,
    avatar_id,
    name: fields.name?.trim() || null,
    species: fields.species?.trim() || null,
    kingdom: fields.kingdom?.trim() || null,
    backstory: fields.backstory?.trim() || null,
    powers: (fields.powers ?? []).map(p => p.trim()).filter(Boolean),
    traits: (fields.traits ?? []).map(t => t.trim()).filter(Boolean),
  };

  const { error } = await client
    .from("character_cards")
    .upsert(payload, { onConflict: "user_id,avatar_id" });

  if (error) throw error;
}

export async function getCardForAvatar(avatarId: string) {
  return supabase
    .from("character_cards")
    .select("*")
    .eq("avatar_id", avatarId)
    .single();
}


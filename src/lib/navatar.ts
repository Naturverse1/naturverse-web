import { supabase } from "./supabase-client";
import type { CharacterCard } from "./types";

export const AVATARS_TABLE = "avatars";
export const AVATARS_BUCKET = "avatars";
const ACTIVE_KEY = "naturverse.active_navatar_id";

// ---- active selection helpers (localStorage) ----
export function loadActive(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function saveActive(id: string) {
  try {
    localStorage.setItem(ACTIVE_KEY, id);
  } catch {}
}

// ---- DB helpers ----
export type AvatarRow = {
  id: string;
  user_id: string | null;
  name: string | null;
  base_type?: string | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
};

// backwards compatibility
export type NavatarRow = AvatarRow;

export function navatarImageUrl(image?: string | null) {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(image);
  return data?.publicUrl ?? null;
}

export async function getMyAvatars(userId: string) {
  const { data, error } = await supabase
    .from(AVATARS_TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listMyNavatars() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not signed in");
  return getMyAvatars(user.id);
}

export async function getCatalogAvatars(limit = 48) {
  const { data, error } = await supabase
    .from(AVATARS_TABLE)
    .select("*")
    .or("user_id.is.null,base_type.eq.catalog")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function setActiveFromId(id: string) {
  const { data, error } = await supabase
    .from(AVATARS_TABLE)
    .select("id")
    .eq("id", id)
    .single();
  if (error) throw error;
  if (data?.id) saveActive(data.id);
  return data?.id ?? null;
}

export async function uploadAvatarFile(
  file: File,
  userId: string,
  name?: string
) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { data: up, error: upErr } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(fileName, file, { cacheControl: "3600", upsert: false });
  if (upErr) throw upErr;

  const { data: pub } = supabase.storage
    .from(AVATARS_BUCKET)
    .getPublicUrl(up!.path);

  const { data: row, error: insErr } = await supabase
    .from(AVATARS_TABLE)
    .insert({
      id: crypto.randomUUID(),
      user_id: userId,
      name: name || file.name.replace(/\.[^.]+$/, ""),
      image_url: pub.publicUrl,
      base_type: "upload",
    })
    .select("*")
    .single();
  if (insErr) throw insErr;
  if (row?.id) saveActive(row.id);
  return row;
}

// Backwards-compatible helper
export async function saveNavatar(opts: {
  name?: string;
  base_type?: string;
  backstory?: string;
  file?: File | null;
}) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not signed in");
  if (!opts.file) throw new Error("No file provided");
  return uploadAvatarFile(opts.file, user.id, opts.name);
}

// ---- Character card helpers (unchanged) ----
export async function fetchMyCharacterCard(): Promise<CharacterCard | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const activeId = loadActive();
  if (!user || !activeId) return null;
  const { data, error } = await supabase
    .from("character_cards")
    .select("*")
    .eq("user_id", user.id)
    .eq("avatar_id", activeId)
    .maybeSingle();
  if (error && (error as any).code !== "PGRST116") throw error;
  return (data as CharacterCard) ?? null;
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


import { supabase } from "../lib/supabase-client";

export type AvatarRow = {
  id: string;
  user_id: string;
  name: string | null;
  image_url: string | null;
  image_path: string | null;
  is_primary: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export async function getUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw error ?? new Error("Not signed in");
  return data.user.id;
}

export async function getCurrentAvatar(): Promise<AvatarRow | null> {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("avatars")
    .select("*")
    .eq("user_id", userId)
    .order("is_primary", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertPrimaryAvatar(fields: Partial<AvatarRow>) {
  const userId = await getUserId();
  const payload = {
    user_id: userId,
    is_primary: true,
    updated_at: new Date().toISOString(),
    ...fields,
  };
  const { data, error } = await supabase
    .from("avatars")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();
  if (error) throw error;
  return data as AvatarRow;
}

/** Picking from static /public/navatars/photos */
export async function pickStaticAvatar(imageUrl: string, name?: string) {
  return upsertPrimaryAvatar({
    name: name ?? "Navatar",
    image_url: imageUrl,
    image_path: null,
  });
}

/** Uploading a file to Storage then upserting DB row */
export async function uploadAvatar(file: File, name?: string) {
  const userId = await getUserId();
  const path = `${userId}/${crypto.randomUUID()}-${file.name}`;
  const { error: upErr } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
  return upsertPrimaryAvatar({
    name: name ?? file.name,
    image_url: pub.publicUrl,
    image_path: path,
  });
}

/** Character card */
export type CharacterCard = {
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  powers?: string[];
  traits?: string[];
};

export async function getMyCard() {
  const userId = await getUserId();
  const { data, error } = await supabase
    .from("character_cards")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveMyCard(card: CharacterCard) {
  const userId = await getUserId();
  const payload = {
    user_id: userId,
    ...card,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("character_cards")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}


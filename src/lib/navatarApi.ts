import { supabase } from "./supabase-client";

export type AvatarRow = {
  id: string;
  user_id: string | null;
  name: string | null;
  image_url: string | null;
  image_path: string | null;
  thumbnail_url: string | null;
  metadata: any | null;
  is_public: boolean | null;
  is_primary: boolean | null;
  created_at?: string;
};

export type CharacterCard = {
  id?: string;
  user_id: string;
  avatar_id: string | null;
  name?: string | null;
  species?: string | null;
  kingdom?: string | null;
  backstory?: string | null;
  powers?: string[] | null;
  traits?: string[] | null;
};

export async function getSessionUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw error ?? new Error("Not signed in");
  return data.user;
}

/** PUBLIC BROWSER LIST for Pick page */
export async function listPublicAvatars(): Promise<AvatarRow[]> {
  const { data, error } = await supabase
    .from("avatars")
    .select("id,name,image_url,thumbnail_url,image_path,is_public")
    .eq("is_public", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AvatarRow[];
}

/** My primary avatar (for /navatar & /navatar/mint) */
export async function getMyPrimaryAvatar(): Promise<AvatarRow | null> {
  const user = await getSessionUser();
  const { data, error } = await supabase
    .from("avatars")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_primary", true)
    .maybeSingle();
  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

/** Make selected avatar primary for me.
 *  If it's a public stock avatar, duplicate a row for me; else toggle mine. */
export async function pickAvatar(stock: AvatarRow): Promise<AvatarRow> {
  const user = await getSessionUser();

  // Clear any existing primary
  await supabase
    .from("avatars")
    .update({ is_primary: false })
    .eq("user_id", user.id)
    .eq("is_primary", true);

  if (stock.user_id === user.id) {
    const { data, error } = await supabase
      .from("avatars")
      .update({ is_primary: true })
      .eq("id", stock.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Duplicate (reference same storage path/urls)
  const insert = {
    user_id: user.id,
    name: stock.name,
    image_url: stock.image_url,
    image_path: stock.image_path,
    thumbnail_url: stock.thumbnail_url,
    metadata: stock.metadata,
    is_public: false,
    is_primary: true
  };
  const { data, error } = await supabase
    .from("avatars")
    .insert(insert)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Upload an image to storage bucket 'avatars' and create primary row */
export async function uploadAvatar(file: File, name?: string): Promise<AvatarRow> {
  const user = await getSessionUser();
  const path = `${user.id}/${Date.now()}_${file.name}`;
  const { error: upErr } = await supabase
    .storage.from("avatars")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (upErr) throw upErr;

  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);

  // Clear existing primary then insert
  await supabase
    .from("avatars")
    .update({ is_primary: false })
    .eq("user_id", user.id)
    .eq("is_primary", true);

  const { data, error } = await supabase
    .from("avatars")
    .insert({
      user_id: user.id,
      name: name ?? file.name.replace(/\.[^.]+$/, ""),
      image_path: path,
      image_url: urlData.publicUrl,
      is_public: false,
      is_primary: true
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Save or update my character card for my current primary avatar */
export async function saveCharacterCard(
  card: Omit<CharacterCard, "user_id" | "avatar_id">
) {
  const user = await getSessionUser();
  const avatar = await getMyPrimaryAvatar();
  const payload: CharacterCard = {
    user_id: user.id,
    avatar_id: avatar ? avatar.id : null,
    name: card.name ?? null,
    species: card.species ?? null,
    kingdom: card.kingdom ?? null,
    backstory: card.backstory ?? null,
    powers: card.powers ?? null,
    traits: card.traits ?? null
  };

  // Upsert by user_id (works with migration above)
  const { data, error } = await supabase
    .from("character_cards")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMyCharacterCard(): Promise<CharacterCard | null> {
  const user = await getSessionUser();
  const { data, error } = await supabase
    .from("character_cards")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

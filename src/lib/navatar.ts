import { supabase } from "./supabase-client";

export const NAVATAR_BUCKET = "avatars";
export const NAVATAR_PREFIX = "navatars";

export type Navatar = {
  id: string;
  user_id: string;
  name: string | null;
  species: string | null;
  kingdom: string | null;
  backstory: string | null;
  image_url: string | null;
  image_path?: string | null;
  created_at: string;
  updated_at: string;
};

export type NavatarCard = {
  id: string;
  user_id: string;
  navatar_id: string;
  name: string | null;
  species: string | null;
  kingdom: string | null;
  backstory: string | null;
  powers: string[] | null;
  traits: string[] | null;
  created_at: string;
  updated_at: string;
};

export type CharacterCard = NavatarCard;

const cleanField = (value?: string | null) => {
  const text = (value ?? "").toString().trim();
  return text.length > 0 ? text : null;
};

const cleanList = (list?: string[] | null) =>
  Array.isArray(list) ? list.map(item => item.trim()).filter(Boolean) : [];

const withoutUndefined = <T extends Record<string, any>>(value: T) =>
  Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as T;

async function fetchNavatarForUser(userId: string): Promise<Navatar | null> {
  const { data, error } = await supabase
    .from("navatars")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error && (error as any).code !== "PGRST116") throw error;
  return (data as Navatar | null) ?? null;
}

function mapNavatarPatch(
  partial: Partial<Omit<Navatar, "id" | "user_id" | "created_at" | "updated_at">>
) {
  const patch: Record<string, any> = {};
  if (partial.name !== undefined) patch.name = cleanField(partial.name);
  if (partial.species !== undefined) patch.species = cleanField(partial.species);
  if (partial.kingdom !== undefined) patch.kingdom = cleanField(partial.kingdom);
  if (partial.backstory !== undefined) patch.backstory = cleanField(partial.backstory);
  if ((partial as any).image_url !== undefined) patch.image_url = (partial as any).image_url ?? null;
  if ((partial as any).image_path !== undefined) patch.image_path = (partial as any).image_path ?? null;
  if ((partial as any).thumbnail_url !== undefined)
    patch.thumbnail_url = (partial as any).thumbnail_url ?? null;
  if ((partial as any).is_public !== undefined) patch.is_public = (partial as any).is_public ?? null;
  if ((partial as any).is_primary !== undefined) patch.is_primary = (partial as any).is_primary ?? null;
  if ((partial as any).metadata !== undefined) patch.metadata = (partial as any).metadata ?? null;
  return withoutUndefined(patch);
}

function mapCardPatch(
  payload: Omit<Partial<NavatarCard>, "id" | "user_id" | "navatar_id" | "created_at" | "updated_at">
) {
  const patch: Record<string, any> = {};
  if (payload.name !== undefined) patch.name = cleanField(payload.name);
  if (payload.species !== undefined) patch.species = cleanField(payload.species);
  if (payload.kingdom !== undefined) patch.kingdom = cleanField(payload.kingdom);
  if (payload.backstory !== undefined) patch.backstory = cleanField(payload.backstory);
  if (payload.powers !== undefined) patch.powers = cleanList(payload.powers ?? []);
  if (payload.traits !== undefined) patch.traits = cleanList(payload.traits ?? []);
  return withoutUndefined(patch);
}

export async function getSessionUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error("Not signed in");
  return user.id;
}

export function navatarImageUrl(path: string | null | undefined) {
  if (!path) return null;
  const { data } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(path);
  return data?.publicUrl ?? null;
}

export async function listNavatars(): Promise<{ name: string; url: string; path: string }[]> {
  const { data, error } = await supabase
    .storage.from(NAVATAR_BUCKET)
    .list(NAVATAR_PREFIX, { limit: 200, sortBy: { column: "name", order: "asc" } });

  if (error) throw error;

  return (data ?? [])
    .filter(item => item.name && !item.name.endsWith("/"))
    .map(item => {
      const path = `${NAVATAR_PREFIX}/${item.name}`;
      const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(path);
      return { name: item.name!, url: pub.publicUrl, path };
    });
}

export async function getOrCreateNavatar(userId: string): Promise<Navatar> {
  const existing = await fetchNavatarForUser(userId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from("navatars")
    .insert({ user_id: userId })
    .select("*")
    .single();
  if (error) throw error;
  return data as Navatar;
}

export async function upsertNavatar(
  userId: string,
  partial: Partial<Omit<Navatar, "id" | "user_id" | "created_at" | "updated_at">>
) {
  const base = await getOrCreateNavatar(userId);
  const patch = mapNavatarPatch(partial);
  if (Object.keys(patch).length === 0) {
    return base;
  }

  const { data, error } = await supabase
    .from("navatars")
    .update(patch)
    .eq("id", base.id)
    .eq("user_id", userId)
    .select("*")
    .single();
  if (error) throw error;
  return data as Navatar;
}

export async function getCardForNavatar(userId: string) {
  const { data, error } = await supabase
    .from("navatar_cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error && (error as any).code !== "PGRST116") throw error;
  return (data as NavatarCard | null) ?? null;
}

export async function upsertCard(
  userId: string,
  navatarId: string,
  payload: Omit<Partial<NavatarCard>, "id" | "user_id" | "navatar_id" | "created_at" | "updated_at">
) {
  const patch = mapCardPatch(payload);
  const existing = await getCardForNavatar(userId);

  if (existing) {
    const { data, error } = await supabase
      .from("navatar_cards")
      .update(patch)
      .eq("id", existing.id)
      .eq("user_id", userId)
      .select("*")
      .single();
    if (error) throw error;
    return data as NavatarCard;
  }

  const { data, error } = await supabase
    .from("navatar_cards")
    .insert({ user_id: userId, navatar_id: navatarId, ...patch })
    .select("*")
    .single();
  if (error) throw error;
  return data as NavatarCard;
}

export async function pickNavatar(imagePath: string, name?: string) {
  const userId = await getSessionUserId();
  const navatar = await getOrCreateNavatar(userId);
  const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(imagePath);
  const patch: Partial<Navatar> = {
    image_url: pub.publicUrl,
    image_path: imagePath,
  };
  if (name && !navatar.name) {
    patch.name = name;
  }
  return await upsertNavatar(userId, patch);
}

export async function uploadNavatar(file: File, name?: string) {
  const userId = await getSessionUserId();
  const key = `${NAVATAR_PREFIX}/${userId}/${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase
    .storage.from(NAVATAR_BUCKET)
    .upload(key, file, { upsert: true });
  if (uploadError) throw uploadError;

  const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(key);

  return await upsertNavatar(userId, {
    name,
    image_url: pub.publicUrl,
    image_path: key,
  });
}

export async function getMyAvatar() {
  try {
    const userId = await getSessionUserId();
    return await fetchNavatarForUser(userId);
  } catch (error: any) {
    if (error?.code === "PGRST116") return null;
    throw error;
  }
}

export async function getMyCharacterCard(): Promise<NavatarCard | null> {
  const userId = await getSessionUserId();
  return await getCardForNavatar(userId);
}

export async function saveCharacterCard(input: {
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  powers?: string[];
  traits?: string[];
}) {
  const userId = await getSessionUserId();
  const navatar = await upsertNavatar(userId, {
    name: input.name,
    species: input.species,
    kingdom: input.kingdom,
    backstory: input.backstory,
  });

  return await upsertCard(userId, navatar.id, {
    name: input.name,
    species: input.species,
    kingdom: input.kingdom,
    backstory: input.backstory,
    powers: input.powers,
    traits: input.traits,
  });
}

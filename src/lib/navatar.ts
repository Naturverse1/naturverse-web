import { supabase } from './supabase-client';

export const NAVATAR_BUCKET = 'avatars';
export const NAVATAR_PREFIX = 'navatars';

export type DbAvatar = {
  id: string;
  user_id: string | null;
  name: string | null;
  image_url: string | null;
  image_path: string | null;
  thumbnail_url: string | null;
  is_public: boolean | null;
  is_primary: boolean | null;
  metadata: Record<string, any> | null;
  card: Record<string, any> | null;
  updated_at: string | null;
};

export type CharacterCard = {
  id?: string;
  user_id: string;
  avatar_id: string | null;
  name: string | null;
  species: string | null;
  kingdom: string | null;
  backstory: string | null;
  powers: string[] | null;
  traits: string[] | null;
};

export async function getSessionUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  return user.id;
}

export function navatarImageUrl(path: string | null) {
  if (!path) return null;
  const { data } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(path);
  return data?.publicUrl ?? null;
}

/** List available navatars to pick (reads files under avatars/navatars) */
export async function listNavatars(): Promise<{ name: string; url: string; path: string }[]> {
  const { data, error } = await supabase
    .storage.from(NAVATAR_BUCKET)
    .list(NAVATAR_PREFIX, { limit: 200, sortBy: { column: 'name', order: 'asc' } });

  if (error) throw error;

  return (data ?? [])
    .filter(item => item.name && !item.name.endsWith('/'))
    .map(item => {
      const path = `${NAVATAR_PREFIX}/${item.name}`;
      const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(path);
      return { name: item.name!, url: pub.publicUrl, path };
    });
}

/** Pick an existing image as the user’s avatar (upsert into public.avatars by user_id) */
export async function pickNavatar(imagePath: string, name?: string) {
  const user_id = await getSessionUserId();
  const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(imagePath);

  const { data, error } = await supabase
    .from('avatars')
    .upsert({
      user_id,
      name: name ?? 'Me',
      image_url: pub.publicUrl,
      image_path: imagePath,
      is_primary: true,
      is_public: false,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data as DbAvatar;
}

/** Upload a custom image to navatars/<user_id>/… and upsert avatars row */
export async function uploadNavatar(file: File, name?: string) {
  const user_id = await getSessionUserId();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const key = `${NAVATAR_PREFIX}/${user_id}/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase
    .storage.from(NAVATAR_BUCKET)
    .upload(key, file, { upsert: true });

  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(key);

  const { data, error } = await supabase
    .from('avatars')
    .upsert({
      user_id,
      name: name ?? 'Me',
      image_url: pub.publicUrl,
      image_path: key,
      is_primary: true,
      is_public: false,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data as DbAvatar;
}

/** Load the current user’s avatar (avatars row) */
export async function getMyAvatar() {
  const user_id = await getSessionUserId();
  const { data, error } = await supabase
    .from('avatars')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return (data as DbAvatar | null) ?? null;
}

/** Load the current user's character card */
export async function getMyCharacterCard() {
  const user_id = await getSessionUserId();
  const { data, error } = await supabase
    .from('character_cards')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return (data as CharacterCard | null) ?? null;
}

/** Save / upsert the character card, link to avatar row */
export async function saveCharacterCard(input: Omit<CharacterCard, 'user_id' | 'avatar_id'>) {
  const user_id = await getSessionUserId();
  const myAvatar = await getMyAvatar();
  const avatar_id = myAvatar?.id ?? null;

  const payload: CharacterCard = {
    user_id,
    avatar_id,
    ...input,
    powers: input.powers?.map(s => s.trim()).filter(Boolean) ?? null,
    traits: input.traits?.map(s => s.trim()).filter(Boolean) ?? null,
  };

  const { data, error } = await supabase
    .from('character_cards')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data as CharacterCard;
}

/** Get character card for a specific avatar */
export async function getCharacterCardForAvatar(avatarId: string) {
  const { data, error } = await supabase
    .from('character_cards')
    .select('*')
    .eq('avatar_id', avatarId)
    .single();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return (data as CharacterCard | null) ?? null;
}

/**
 * Return a stable route where the app edits / displays a card for a given Navatar.
 * We keep it a front-end route so it works regardless of API shape.
 */
export function getCardForAvatar(avatarId: string): string {
  if (!avatarId) return '/navatar/card';
  const q = new URLSearchParams({ avatarId }).toString();
  return `/navatar/card?${q}`;
}


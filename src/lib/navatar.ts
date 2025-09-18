import { supabase } from './supabase-client';

export const NAVATAR_BUCKET = 'avatars';
export const NAVATAR_PREFIX = 'navatars';

export type DbNavatar = {
  id: string;
  user_id: string | null;
  name: string | null;
  image_url: string | null;
  image_path: string | null;
  thumbnail_url: string | null;
  metadata: Record<string, any> | null;
  card: Record<string, any> | null;
  created_at?: string | null;
  updated_at: string | null;
};

export type NavatarCard = {
  id?: string;
  user_id: string;
  navatar_id: string | null;
  name: string | null;
  species: string | null;
  kingdom: string | null;
  backstory: string | null;
  powers: string[] | null;
  traits: string[] | null;
  created_at?: string | null;
  updated_at?: string | null;
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

/** Pick an existing image as the user’s navatar (upsert into public.navatars by user_id) */
export async function pickNavatar(imagePath: string, name?: string) {
  const user_id = await getSessionUserId();
  const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(imagePath);

  const { data, error } = await supabase
    .from('navatars')
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
  return data as DbNavatar;
}

/** Upload a custom image to navatars/<user_id>/… and upsert navatars row */
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
    .from('navatars')
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
  return data as DbNavatar;
}

/** Load the current user’s navatar */
export async function getMyNavatar() {
  const user_id = await getSessionUserId();
  const { data, error } = await supabase
    .from('navatars')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return (data as DbNavatar | null) ?? null;
}

/** Load the current user's navatar card */
export async function getMyNavatarCard() {
  const user_id = await getSessionUserId();
  const { data, error } = await supabase
    .from('navatar_cards')
    .select('*')
    .eq('user_id', user_id)
    .single();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return (data as NavatarCard | null) ?? null;
}

/** Save / upsert the navatar card, link to navatar row */
export async function saveNavatarCard(input: Omit<NavatarCard, 'user_id' | 'navatar_id' | 'created_at' | 'updated_at'>) {
  const user_id = await getSessionUserId();
  const myNavatar = await getMyNavatar();
  const navatar_id = myNavatar?.id ?? null;

  if (!navatar_id) {
    throw new Error('Pick a Navatar first');
  }

  const payload: NavatarCard = {
    user_id,
    navatar_id,
    ...input,
    powers: input.powers?.map(s => s.trim()).filter(Boolean) ?? null,
    traits: input.traits?.map(s => s.trim()).filter(Boolean) ?? null,
  };

  const { data, error } = await supabase
    .from('navatar_cards')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data as NavatarCard;
}

/** Get navatar card for a specific navatar */
export async function getCardForNavatar(navatarId: string) {
  const { data, error } = await supabase
    .from('navatar_cards')
    .select('*')
    .eq('navatar_id', navatarId)
    .single();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return (data as NavatarCard | null) ?? null;
}


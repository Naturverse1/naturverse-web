import { supabase } from './supabase-client';
import { upsertNavatarWithCard } from './supabaseHelpers';

export const NAVATAR_BUCKET = 'avatars';
export const NAVATAR_PREFIX = 'navatars';

export type NavatarRecord = {
  id: string;
  owner_id: string | null;
  name: string | null;
  base_type?: string | null;
  species?: string | null;
  kingdom?: string | null;
  backstory?: string | null;
  image_url: string | null;
  image_path: string | null;
  thumbnail_url: string | null;
  is_public: boolean | null;
  is_primary: boolean | null;
  metadata: Record<string, unknown> | null;
  card: Record<string, unknown> | null;
  updated_at: string | null;
};

export type NavatarCard = {
  id: string;
  owner_id: string;
  name: string | null;
  species: string | null;
  kingdom: string | null;
  backstory: string | null;
  powers: string[];
  traits: string[];
  created_at: string | null;
  updated_at: string | null;
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

/** Pick an existing image as the user’s navatar (upsert into public.navatars by owner_id) */
export async function pickNavatar(imagePath: string, name?: string) {
  const ownerId = await getSessionUserId();
  const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(imagePath);

  const { data, error } = await supabase
    .from('navatars')
    .upsert({
      owner_id: ownerId,
      name: name ?? 'Me',
      image_url: pub.publicUrl,
      image_path: imagePath,
      is_primary: true,
      is_public: false,
      updated_at: new Date().toISOString()
    }, { onConflict: 'owner_id' })
    .select()
    .single();

  if (error) throw error;
  return data as NavatarRecord;
}

/** Upload a custom image to navatars/<owner_id>/… and upsert navatars row */
export async function uploadNavatar(file: File, name?: string) {
  const ownerId = await getSessionUserId();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const key = `${NAVATAR_PREFIX}/${ownerId}/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase
    .storage.from(NAVATAR_BUCKET)
    .upload(key, file, { upsert: true });

  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(key);

  const { data, error } = await supabase
    .from('navatars')
    .upsert({
      owner_id: ownerId,
      name: name ?? 'Me',
      image_url: pub.publicUrl,
      image_path: key,
      is_primary: true,
      is_public: false,
      updated_at: new Date().toISOString()
    }, { onConflict: 'owner_id' })
    .select()
    .single();

  if (error) throw error;
  return data as NavatarRecord;
}

/** Load the current user’s navatar */
export async function getMyNavatar() {
  const ownerId = await getSessionUserId();
  const { data, error } = await supabase
    .from('navatars')
    .select('*')
    .eq('owner_id', ownerId)
    .single();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return (data as NavatarRecord | null) ?? null;
}

/** Load the current user's navatar card */
export async function getMyNavatarCard(): Promise<NavatarCard | null> {
  const ownerId = await getSessionUserId();
  const { data, error } = await supabase
    .from('navatars')
    .select(
      'id, owner_id, name, species, kingdom, backstory, created_at, updated_at, navatar_cards(powers, traits, updated_at)'
    )
    .eq('owner_id', ownerId)
    .order('updated_at', { ascending: false, nullsFirst: true })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && (error as any).code !== 'PGRST116') throw error;
  if (!data) return null;

  const metaRaw = (data as any).navatar_cards;
  const meta = Array.isArray(metaRaw) ? metaRaw[0] : metaRaw;
  const powers = (meta?.powers as string[] | null) ?? [];
  const traits = (meta?.traits as string[] | null) ?? [];

  return {
    id: data.id as string,
    owner_id: data.owner_id as string,
    name: (data as any).name ?? null,
    species: (data as any).species ?? null,
    kingdom: (data as any).kingdom ?? null,
    backstory: (data as any).backstory ?? null,
    powers,
    traits,
    created_at: (data as any).created_at ?? null,
    updated_at: (data as any).updated_at ?? meta?.updated_at ?? null,
  } satisfies NavatarCard;
}

/** Save / upsert the navatar card */
export async function upsertNavatarCard(input: {
  id?: string;
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  powers?: string[];
  traits?: string[];
}) {
  const saved = await upsertNavatarWithCard({
    id: input.id,
    name: input.name ?? '',
    species: input.species ?? '',
    kingdom: input.kingdom ?? '',
    backstory: input.backstory ?? '',
    powers: input.powers ?? [],
    traits: input.traits ?? [],
  });

  const powers = Array.isArray(saved.powers) ? saved.powers : [];
  const traits = Array.isArray(saved.traits) ? saved.traits : [];

  return {
    id: saved.id as string,
    owner_id: saved.owner_id as string,
    name: saved.name ?? null,
    species: saved.species ?? null,
    kingdom: saved.kingdom ?? null,
    backstory: saved.backstory ?? null,
    powers,
    traits,
    created_at: saved.created_at ?? null,
    updated_at: saved.updated_at ?? null,
  } satisfies NavatarCard;
}


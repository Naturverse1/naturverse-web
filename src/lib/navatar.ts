import { supabase } from './supabaseClient';
import { getActiveNavatarId } from './localNavatar';
import { saveNavatar as upsertNavatar } from './supabaseHelpers';

export const NAVATAR_BUCKET = 'avatars';
export const NAVATAR_PREFIX = 'navatars';

export type NavatarRow = {
  id: string;
  owner_id: string;
  user_id: string;
  name: string | null;
  image_url: string | null;
  image_path: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CharacterCard = {
  id: string;
  owner_id: string;
  user_id: string;
  name: string | null;
  species: string | null;
  kingdom: string | null;
  backstory: string | null;
  powers: string[];
  traits: string[];
  created_at: string | null;
  updated_at: string | null;
};

function normalizeOwnership<T extends { owner_id?: string | null; user_id?: string | null }>(row: T) {
  const userId = row.user_id ?? row.owner_id;
  if (!userId) {
    throw new Error('Navatar row is missing user ownership metadata.');
  }

  return {
    ...row,
    user_id: userId,
    owner_id: row.owner_id ?? userId,
  };
}

function normalizeNavatarRow(row: any): NavatarRow {
  return normalizeOwnership(row) as NavatarRow;
}

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

async function resolveExistingNavatarId(userId: string): Promise<string | null> {
  const activeId = getActiveNavatarId();
  if (activeId) return activeId;

  const { data, error } = await supabase
    .from('navatars')
    .select('id')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return (data?.id as string | undefined) ?? null;
}

/** Pick an existing image and upsert it into public.navatars */
export async function pickNavatar(imagePath: string, name?: string): Promise<NavatarRow> {
  const userId = await getSessionUserId();
  const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(imagePath);

  const payload: Record<string, any> = {
    owner_id: userId,
    user_id: userId,
    name: name ?? 'My Navatar',
    image_url: pub.publicUrl ?? null,
    image_path: imagePath,
    updated_at: new Date().toISOString(),
  };

  const existingId = await resolveExistingNavatarId(userId);
  if (existingId) payload.id = existingId;

  const { data, error } = await supabase
    .from('navatars')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .single();

  if (error) throw error;
  return normalizeNavatarRow(data);
}

/** Upload a custom image then store it in public.navatars */
export async function uploadNavatar(file: File, name?: string): Promise<NavatarRow> {
  const userId = await getSessionUserId();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const key = `${NAVATAR_PREFIX}/${userId}/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase
    .storage.from(NAVATAR_BUCKET)
    .upload(key, file, { upsert: true });

  if (upErr) throw upErr;

  return pickNavatar(key, name);
}

/** Load the current user's navatar row */
export async function getMyAvatar(): Promise<NavatarRow | null> {
  const userId = await getSessionUserId();
  const activeId = getActiveNavatarId();

  if (activeId) {
    const { data, error } = await supabase
      .from('navatars')
      .select('*')
      .eq('user_id', userId)
      .eq('id', activeId)
      .maybeSingle();

    if (error && (error as any).code !== 'PGRST116') throw error;
    if (data) return normalizeNavatarRow(data);
  }

  const { data, error } = await supabase
    .from('navatars')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return data ? normalizeNavatarRow(data) : null;
}

/** Load the current user's character card */
export async function getMyCharacterCard(): Promise<CharacterCard | null> {
  const userId = await getSessionUserId();
  const { data, error } = await supabase
    .from('navatars')
    .select(
      'id, user_id, owner_id, name, species, kingdom, backstory, created_at, updated_at, navatar_cards(powers, traits, updated_at)'
    )
    .eq('user_id', userId)
    .order('updated_at', { ascending: false, nullsFirst: true })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && (error as any).code !== 'PGRST116') throw error;
  if (!data) return null;

  const normalized = normalizeOwnership(data);
  const metaRaw = (normalized as any).navatar_cards;
  const meta = Array.isArray(metaRaw) ? metaRaw[0] : metaRaw;
  const powers = (meta?.powers as string[] | null) ?? [];
  const traits = (meta?.traits as string[] | null) ?? [];

  return {
    id: normalized.id as string,
    owner_id: normalized.owner_id as string,
    user_id: normalized.user_id as string,
    name: (normalized as any).name ?? null,
    species: (normalized as any).species ?? null,
    kingdom: (normalized as any).kingdom ?? null,
    backstory: (normalized as any).backstory ?? null,
    powers,
    traits,
    created_at: (normalized as any).created_at ?? null,
    updated_at: (normalized as any).updated_at ?? meta?.updated_at ?? null,
  };
}

/** Save / upsert the character card */
export async function saveCharacterCard(input: {
  id?: string;
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  powers?: string[];
  traits?: string[];
}) {
  const saved = await upsertNavatar({
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
  const normalized = normalizeOwnership(saved);

  return {
    id: normalized.id as string,
    owner_id: normalized.owner_id as string,
    user_id: normalized.user_id as string,
    name: (normalized as any).name ?? null,
    species: (normalized as any).species ?? null,
    kingdom: (normalized as any).kingdom ?? null,
    backstory: (normalized as any).backstory ?? null,
    powers,
    traits,
    created_at: (normalized as any).created_at ?? null,
    updated_at: (normalized as any).updated_at ?? null,
  } satisfies CharacterCard;
}

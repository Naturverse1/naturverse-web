import { supabase } from './supabaseClient';
import { getActiveNavatarId } from './localNavatar';
import { saveNavatar as upsertNavatar } from './supabaseHelpers';
import { getNavatarPublicUrl, uploadNavatarImage, NAVATAR_BUCKET } from './navatar/storage';
export { NAVATAR_BUCKET } from './navatar/storage';

export const NAVATAR_PREFIX = 'navatars';

export type NavatarRow = {
  id: string;
  owner_id: string;
  name: string | null;
  image_url: string | null;
  image_path: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CharacterCard = {
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
  return getNavatarPublicUrl(path);
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
      const publicUrl = getNavatarPublicUrl(path);
      if (!publicUrl) return null;
      return { name: item.name!, url: publicUrl, path };
    })
    .filter((item): item is { name: string; url: string; path: string } => Boolean(item));
}

async function resolveExistingNavatarId(ownerId: string): Promise<string | null> {
  const activeId = getActiveNavatarId();
  if (activeId) return activeId;

  const { data, error } = await supabase
    .from('navatars')
    .select('id')
    .eq('owner_id', ownerId)
    .order('updated_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return (data?.id as string | undefined) ?? null;
}

/** Pick an existing image and upsert it into public.navatars */
export async function pickNavatar(imagePath: string, name?: string): Promise<NavatarRow> {
  const owner_id = await getSessionUserId();
  const existingId = await resolveExistingNavatarId(owner_id);
  const publicUrl = getNavatarPublicUrl(imagePath);

  const saved = await upsertNavatar({
    id: existingId ?? undefined,
    name: name ?? 'My Navatar',
    image_url: publicUrl ?? null,
    image_path: imagePath,
  });

  return saved as NavatarRow;
}

/** Upload a custom image then store it in public.navatars */
export async function uploadNavatar(file: File, name?: string): Promise<NavatarRow> {
  const upload = await uploadNavatarImage(file, name);
  const existingId = await resolveExistingNavatarId(upload.userId);
  const saved = await upsertNavatar({
    id: existingId ?? undefined,
    name: name ?? 'My Navatar',
    image_url: upload.publicUrl ?? null,
    image_path: upload.path,
  });

  return saved as NavatarRow;
}

/** Load the current user's navatar row */
export async function getMyAvatar(): Promise<NavatarRow | null> {
  const owner_id = await getSessionUserId();
  const activeId = getActiveNavatarId();

  if (activeId) {
    const { data, error } = await supabase
      .from('navatars')
      .select('*')
      .eq('owner_id', owner_id)
      .eq('id', activeId)
      .maybeSingle();

    if (error && (error as any).code !== 'PGRST116') throw error;
    if (data) return data as NavatarRow;
  }

  const { data, error } = await supabase
    .from('navatars')
    .select('*')
    .eq('owner_id', owner_id)
    .order('updated_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return (data as NavatarRow | null) ?? null;
}

/** Load the current user's character card */
export async function getMyCharacterCard(): Promise<CharacterCard | null> {
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
  } satisfies CharacterCard;
}

import { supabase } from './supabase-client';

export const NAVATAR_BUCKET = 'avatars';
export const NAVATAR_PREFIX = 'navatars';

export type NavatarRow = {
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

export type NavatarCard = {
  id?: string;
  user_id: string;
  navatar_id: string;
  name: string | null;
  species: string | null;
  kingdom: string | null;
  backstory: string | null;
  powers: string[] | null;
  traits: string[] | null;
};

export async function getSessionUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');
  return user.id;
}

export function navatarImageUrl(path: string | null) {
  if (!path) return null;
  const { data } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(path);
  return data?.publicUrl ?? null;
}

export async function listNavatars(): Promise<{ name: string; url: string; path: string }[]> {
  const { data, error } = await supabase
    .storage.from(NAVATAR_BUCKET)
    .list(NAVATAR_PREFIX, { limit: 200, sortBy: { column: 'name', order: 'asc' } });

  if (error) throw error;

  return (data ?? [])
    .filter((item) => item.name && !item.name.endsWith('/'))
    .map((item) => {
      const path = `${NAVATAR_PREFIX}/${item.name!}`;
      const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(path);
      return { name: item.name!, url: pub.publicUrl, path };
    });
}

export async function pickNavatar(imagePath: string, name?: string) {
  const user_id = await getSessionUserId();
  const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(imagePath);

  const payload = {
    user_id,
    name: name ?? 'Me',
    image_url: pub.publicUrl,
    image_path: imagePath,
    is_primary: true,
    is_public: false,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('navatars')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data as NavatarRow;
}

export async function uploadNavatar(file: File, name?: string) {
  const user_id = await getSessionUserId();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const key = `${NAVATAR_PREFIX}/${user_id}/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase.storage.from(NAVATAR_BUCKET).upload(key, file, { upsert: true });

  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(key);

  const payload = {
    user_id,
    name: name ?? 'Me',
    image_url: pub.publicUrl,
    image_path: key,
    is_primary: true,
    is_public: false,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('navatars')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data as NavatarRow;
}

export async function getMyNavatar() {
  const user_id = await getSessionUserId();
  const { data, error } = await supabase
    .from('navatars')
    .select('*')
    .eq('user_id', user_id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return (data as NavatarRow | null) ?? null;
}

export async function getActiveNavatarId() {
  const navatar = await getMyNavatar();
  return navatar?.id ?? null;
}

export async function getCardForNavatar(navatarId: string) {
  const { data, error } = await supabase
    .from('navatar_cards')
    .select('*')
    .eq('navatar_id', navatarId)
    .maybeSingle();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return (data as NavatarCard | null) ?? null;
}

export async function getMyNavatarCard() {
  const navatarId = await getActiveNavatarId();
  if (!navatarId) return null;
  return getCardForNavatar(navatarId);
}

export async function upsertNavatarCard(card: NavatarCard) {
  const sanitize = (value: unknown, limit = 800) => {
    const trimmed = String(value ?? '').trim().slice(0, limit);
    return trimmed.length > 0 ? trimmed : null;
  };
  const list = (value: string[] | null | undefined) => {
    if (!value) return null;
    const cleaned = value
      .map((entry) => sanitize(entry, 160))
      .filter((entry): entry is string => typeof entry === 'string' && entry.length > 0);
    return cleaned.length > 0 ? cleaned : null;
  };

  const payload: NavatarCard = {
    ...card,
    name: sanitize(card.name, 120),
    species: sanitize(card.species, 120),
    kingdom: sanitize(card.kingdom, 120),
    backstory: sanitize(card.backstory, 2000),
    powers: list(card.powers),
    traits: list(card.traits),
  };

  const { data, error } = await supabase
    .from('navatar_cards')
    .upsert(payload, { onConflict: 'user_id,navatar_id' })
    .select()
    .single();

  if (error) throw error;
  return data as NavatarCard;
}

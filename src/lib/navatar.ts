import { supabase } from './supabaseClient';

export type Avatar = {
  id: string;
  user_id: string;
  name: string | null;
  category: string | null;
  image_url: string | null;
  image_path: string | null;
  thumbnail_url: string | null;
  is_primary: boolean | null;
};

export type CharacterCard = {
  id: string;
  user_id: string;
  avatar_id: string;
  name: string | null;
  species: string | null;
  kingdom: string | null;
  backstory: string | null;
  powers: string[] | null;
  traits: string[] | null;
};

const ACTIVE_KEY = 'naturverse.activeAvatarId';

export async function getMyActiveAvatar(userId: string) {
  // Prefer DB primary; fallback to localStorage id.
  const { data, error } = await supabase
    .from('avatars')
    .select(
      `
      id, user_id, name, category, image_url, image_path, thumbnail_url, is_primary,
      character_cards (
        id, user_id, avatar_id, name, species, kingdom, backstory, powers, traits
      )
    `
    )
    .eq('user_id', userId)
    .order('is_primary', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (error) throw error;

  if (data && data.length) {
    const primary = data.find((a: any) => a.is_primary) ?? data[0];
    // cache
    localStorage.setItem(ACTIVE_KEY, primary.id);
    return primary;
  }

  const local = localStorage.getItem(ACTIVE_KEY);
  if (local) {
    const { data: one } = await supabase.from('avatars').select('*').eq('id', local).maybeSingle();
    return one;
  }
  return null;
}

export async function listMyAvatars(userId: string) {
  const { data, error } = await supabase
    .from('avatars')
    .select('id, user_id, name, image_url, thumbnail_url, is_primary')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Avatar[];
}

export async function pickActiveAvatar(userId: string, avatarId: string) {
  // Clear others then set this one
  const { error: e1 } = await supabase.from('avatars').update({ is_primary: false }).eq('user_id', userId);
  if (e1) throw e1;
  const { error: e2 } = await supabase.from('avatars').update({ is_primary: true }).eq('id', avatarId).eq('user_id', userId);
  if (e2) throw e2;
  localStorage.setItem(ACTIVE_KEY, avatarId);
}

export async function uploadAndInsertAvatar(userId: string, file: File, name?: string) {
  // storage bucket: 'avatars' (public) — folder per user
  const fileName = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, '_')}`;
  const path = `${userId}/${fileName}`;

  const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, {
    upsert: false,
    contentType: file.type || 'image/jpeg'
  });
  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
  const image_url = pub?.publicUrl ?? null;

  // is_primary = true if this is their first avatar
  const { data: count } = await supabase.from('avatars').select('id', { count: 'exact', head: true }).eq('user_id', userId);
  const makePrimary = !count || (typeof count === 'number' && count === 0);

  const insert = {
    user_id: userId,
    name: name || file.name.split('.')[0],
    image_path: path,
    image_url,
    thumbnail_url: image_url,
    is_primary: makePrimary
  };

  const { data, error } = await supabase.from('avatars').insert(insert).select().single();
  if (error) throw error;
  if (makePrimary) localStorage.setItem(ACTIVE_KEY, data.id);
  return data as Avatar;
}

export async function upsertCharacterCard(input: Omit<CharacterCard, 'id'>) {
  // Upsert on (user_id, avatar_id) – requires unique constraint in SQL below
  const { data, error } = await supabase
    .from('character_cards')
    .upsert(input, { onConflict: 'user_id,avatar_id' })
    .select()
    .single();
  if (error) throw error;
  return data as CharacterCard;
}


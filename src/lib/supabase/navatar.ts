import { supabase } from '@/lib/supabase-client';

export type UserNavatar = {
  name?: string | null;
  url: string;
};

export async function getUserNavatar(userId: string): Promise<UserNavatar | null> {
  const { data, error } = await supabase
    .from('user_navatar')
    .select('name, url')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return (data as UserNavatar) ?? null;
}

export async function saveUserNavatar(
  userId: string,
  file: File,
  name?: string
): Promise<UserNavatar> {
  const ext = file.name.split('.').pop() || 'png';
  const path = `${userId}/current.${ext}`;
  await supabase.storage.from('avatars').upload(path, file, { upsert: true });
  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
  await supabase
    .from('user_navatar')
    .upsert({ user_id: userId, name: name ?? 'My Navatar', url: publicUrl }, { onConflict: 'user_id' });
  return { url: publicUrl, name };
}

export type UserCard = {
  user_id: string;
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  powers?: string[];
  traits?: string[];
};

export async function getUserCard(userId: string): Promise<UserCard | null> {
  const { data, error } = await supabase
    .from('navatar_cards')
    .select('name,species,kingdom,backstory,powers,traits')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return (data as UserCard) ?? null;
}

export async function saveUserCard(card: UserCard) {
  await supabase.from('navatar_cards').upsert(card, { onConflict: 'user_id' });
}


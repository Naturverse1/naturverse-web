import { supabase } from './supabase-client';

export type NavatarCard = {
  name?: string;
  species?: string;
  alignment?: string;
  backstory?: string;
  powers?: string[];
  traits?: string[];
};

type AvatarRow = {
  id: string;
  user_id: string;
  image_url: string | null;
  name: string | null;
  card: NavatarCard | null;
};

export async function getMyAvatar(userId: string) {
  const { data, error } = await supabase
    .from('avatars')
    .select('id,user_id,image_url,name,card')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data as AvatarRow;
}

export async function saveAvatarCard(userId: string, card: NavatarCard) {
  const { data, error } = await supabase
    .from('avatars')
    .upsert({ user_id: userId, card }, { onConflict: 'user_id' })
    .select('id,card')
    .single();
  if (error) throw error;
  return data as AvatarRow | null;
}

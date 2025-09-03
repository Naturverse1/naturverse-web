import { supabase } from './supabaseClient';

export type AvatarRow = {
  id?: string;
  user_id: string;
  name: string;
  category: 'canon' | 'upload' | 'generate';
  method: 'system' | 'upload' | 'generate' | 'ai';
  image_url: string;
  updated_at?: string;
};

export async function getMyAvatar() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('avatars')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data as AvatarRow | null;
}

export async function upsertMyAvatar(payload: Omit<AvatarRow, 'id'|'updated_at'|'user_id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Please sign in');

  const { error } = await supabase
    .from('avatars')
    .upsert({
      user_id: user.id,
      ...payload
    }, { onConflict: 'user_id', ignoreDuplicates: false });

  if (error) throw error;
}

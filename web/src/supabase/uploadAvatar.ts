import { supabase } from '../supabaseClient';

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const path = `${userId}.png`;
  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}

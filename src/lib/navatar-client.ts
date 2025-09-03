import { supabase } from './supabase-browser';

export type NewAvatar = {
  name: string;
  category?: string | null;
  image_url: string;
  method: 'upload' | 'ai' | 'system' | 'generate';
  appearance_data?: any;
};

export async function getUserId() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user?.id ?? null;
}

export async function listNavatars() {
  const { data, error } = await supabase
    .from('avatars')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createAvatarRow(a: NewAvatar) {
  const userId = await getUserId();
  if (!userId) throw new Error('Please sign in to create a Navatar.');
  const { error } = await supabase.from('avatars').insert({
    user_id: userId,
    name: a.name,
    category: a.category ?? 'avatar',
    image_url: a.image_url,
    method: a.method,
    appearance_data: a.appearance_data ?? null,
  });
  if (error) throw error;
}

export async function deleteAvatar(id: string) {
  const { error } = await supabase.from('avatars').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadToStorage(file: File, userId: string) {
  const ext = file.name.split('.').pop() || 'png';
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('avatars').upload(path, file, {
    contentType: file.type || 'image/png',
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}


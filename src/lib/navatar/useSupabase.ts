import { supabase } from '@/lib/supabaseClient';

export type AvatarRowPayload = {
  id?: string;
  owner_id: string;
  name?: string | null;
  image_url?: string | null;
  image_path?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
};

// Table writes
export async function saveAvatarRow(payload: AvatarRowPayload) {
  const { data, error } = await supabase
    .from('navatars')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function listAvatarsByUser(userId: string) {
  return await supabase
    .from('navatars')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });
}

// Storage bucket **avatars**
export async function uploadAvatarImage(userId: string, file: File) {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from('avatars').upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
    contentType: file.type || 'image/png',
  });

  if (error) throw error;

  const { data: pub } = await supabase.storage.from('avatars').getPublicUrl(path);
  return { publicUrl: pub.publicUrl, path };
}


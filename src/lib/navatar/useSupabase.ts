import { supabase } from '@/lib/supabaseClient';

// Table names are navatars; storage bucket remains **avatars**
export async function saveAvatarRow(payload: any) {
  // e.g., { user_id, name, image_url, meta }
  return await supabase.from('navatars').insert(payload).select().single();
}

export async function listAvatarsByUser(userId: string) {
  return await supabase
    .from('navatars')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

// Storage bucket also **avatars**
export async function uploadAvatarImage(userId: string, file: File) {
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase
    .storage
    .from('avatars')
    .upload(path, file, { upsert: false });
  if (error) throw error;
  const { data: pub } = await supabase.storage
    .from('avatars')
    .getPublicUrl(path);
  return pub.publicUrl; // public URL for card
}

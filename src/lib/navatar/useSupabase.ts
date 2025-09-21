import { supabase } from '@/lib/supabaseClient';
import { NAVATAR_BUCKET } from '@/lib/storage';

// Table names are navatars; storage bucket is navatars
export async function saveAvatarRow(payload: any) {
  // e.g., { owner_id, name, image_url, meta }
  return await supabase.from('navatars').insert(payload).select().single();
}

export async function listAvatarsByUser(userId: string) {
  return await supabase
    .from('navatars')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });
}

// Storage bucket helper
export async function uploadAvatarImage(userId: string, file: File) {
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase
    .storage
    .from(NAVATAR_BUCKET)
    .upload(path, file, { upsert: false });
  if (error) throw error;
  const { data: pub } = await supabase.storage
    .from(NAVATAR_BUCKET)
    .getPublicUrl(path);
  return pub.publicUrl; // public URL for card
}

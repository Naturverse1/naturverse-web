import { supabase } from '@/lib/supabaseClient';

// Table names are navatars; storage bucket remains **avatars**
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

// Storage bucket also **avatars**
export async function uploadAvatarImage(userId: string, file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const uniqueId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const path = `navatars/${userId}/${uniqueId}.${ext}`;
  const { error: uploadError } = await supabase
    .storage
    .from('avatars')
    .upload(path, file, {
      upsert: false,
      contentType: file.type || 'image/png',
      cacheControl: '3600',
    });
  if (uploadError) throw uploadError;

  const { data: pub } = await supabase.storage
    .from('avatars')
    .getPublicUrl(path);

  return { publicUrl: pub?.publicUrl ?? null, path };
}

import { supabase } from '@/lib/supabaseClient';

function sanitizeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\.\-_]/g, '_');
}

export async function uploadAvatar(userId: string, file: File) {
  const ext = file.name.split('.').pop() ?? 'png';
  const path = `avatars/${userId}/${Date.now()}-${sanitizeFilename(file.name)}.${ext}`;

  const { data, error } = await supabase.storage.from('avatars').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) throw error;
  return data?.path;
}

export async function getPublicUrl(path: string) {
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}

// Generic helper for other buckets (navatars, products)
export async function uploadToBucket(bucket: string, userId: string, file: File) {
  const ext = file.name.split('.').pop() ?? 'png';
  const filePath = `${userId}/${Date.now()}-${sanitizeFilename(file.name)}.${ext}`;
  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  return data?.path;
}

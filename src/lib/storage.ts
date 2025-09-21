import { supabase } from '@/lib/supabaseClient';
import { nanoid } from 'nanoid';

function sanitizeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\.\-_]/g, '_');
}

export const NAVATAR_BUCKET = 'navatars';

export async function uploadNavatar(file: File, userId: string, name?: string) {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  const id = nanoid(12);
  const path = `${userId}/${id}.${ext}`;

  const { error: upErr } = await supabase.storage.from(NAVATAR_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });

  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(path);

  return {
    id,
    image_path: path,
    image_url: pub.publicUrl,
    name: (name || null) as string | null,
  };
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

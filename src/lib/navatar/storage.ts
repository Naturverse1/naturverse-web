import { supabase } from '@/lib/supabaseClient';
import { getUserId } from '@/lib/session';

export const NAVATAR_BUCKET = 'avatars';

function inferExt(file: File) {
  const fromType = file.type?.split('/')?.[1];
  if (fromType) return fromType;

  const name = file.name || 'upload';
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot + 1) : 'png';
}

function slug(input: string | undefined) {
  return (input || 'navatar')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getNavatarPublicUrl(path: string | null) {
  if (!path) return null;
  const { data } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(path);
  return data?.publicUrl ?? null;
}

export async function uploadNavatarImage(file: File, displayName?: string) {
  const userId = await getUserId();
  if (!userId) throw new Error('Not signed in');

  const ext = inferExt(file);
  const key = `navatars/${userId}/${Date.now()}-${slug(displayName)}.${ext}`;

  const { error } = await supabase.storage.from(NAVATAR_BUCKET).upload(key, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  const publicUrl = getNavatarPublicUrl(key);
  return { path: key, publicUrl, userId };
}

// Avatar upload helpers for Naturverse
import { SupabaseClient } from '@supabase/supabase-js';

export function getFileExt(name: string): string {
  return name.split('.').pop()?.toLowerCase() || '';
}

export async function uploadAvatar(
  supabase: SupabaseClient,
  userId: string,
  file: File
): Promise<{ publicUrl: string; path: string }> {
  const ext = getFileExt(file.name);
  const filename = crypto.randomUUID() + '.' + ext;
  const path = `avatars/${userId}/${filename}`;
  const { error: upErr } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type });
  if (upErr) throw upErr;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  let publicUrl = data?.publicUrl;
  if (!publicUrl) {
    // fallback: construct public URL manually
    const { data: bucket } = await supabase.storage.getBucket('avatars');
    const base = supabase.storageUrl || '';
    publicUrl = `${base}/object/public/${path}`;
  }
  return { publicUrl, path };
}

export async function removeAvatarIfExists(
  supabase: SupabaseClient,
  avatarUrl?: string
): Promise<void> {
  if (!avatarUrl) return;
  // Extract storage path from public URL
  const idx = avatarUrl.indexOf('/object/public/');
  if (idx === -1) return;
  const storagePath = avatarUrl.substring(idx + '/object/public/'.length);
  await supabase.storage.from('avatars').remove([storagePath]);
}

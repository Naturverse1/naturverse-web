import { createClient } from '@supabase/supabase-js';

export type UploadResult = { publicUrl: string; path: string };

export function getFileExt(name: string) {
  const i = name.lastIndexOf('.');
  return i === -1 ? 'png' : name.slice(i + 1).toLowerCase();
}

export async function uploadAvatar(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  file: File
): Promise<UploadResult> {
  const ext = getFileExt(file.name);
  const filename = `${crypto.randomUUID()}.${ext}`;
  const path = `avatars/${userId}/${filename}`;

  const { error: upErr } = await supabase
    .storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type });

  if (upErr) throw upErr;

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return { publicUrl: data.publicUrl, path };
}

export async function removeAvatarIfExists(
  supabase: ReturnType<typeof createClient>,
  avatarPath?: string,
  avatarUrl?: string
): Promise<void> {
  let storagePath = avatarPath;
  if (!storagePath && avatarUrl) {
    const idx = avatarUrl.indexOf('/object/public/');
    if (idx !== -1) storagePath = avatarUrl.slice(idx + '/object/public/'.length);
  }
  if (!storagePath) return;
  // Ignore not found errors
  await supabase.storage.from('avatars').remove([storagePath]).catch(() => {});
}

// helpers
export function getFileExt(name: string) {
  const i = name.lastIndexOf('.');
  return i === -1 ? '' : name.slice(i + 1).toLowerCase();
}

export async function uploadAvatar(
  supabase: any,
  userId: string,
  file: File
): Promise<{ publicUrl: string; path: string }> {
  const ext = getFileExt(file.name) || 'png';
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
  supabase: any,
  avatarUrl?: string
): Promise<void> {
  if (!avatarUrl) return;
  // convert https://…/object/public/avatars/uid/file.png -> avatars/uid/file.png
  const idx = avatarUrl.indexOf('/object/public/');
  const storagePath = idx === -1 ? '' : avatarUrl.substring(idx + '/object/public/'.length);
  if (!storagePath) return;
  await supabase.storage.from('avatars').remove([storagePath]); // ignore not found
}

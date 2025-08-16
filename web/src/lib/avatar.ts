/* Avatar helpers for Supabase Storage */
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

  const { data } = supabase
    .storage
    .from('avatars')
    .getPublicUrl(path);

  return { publicUrl: data.publicUrl, path };
}

export async function removeAvatarIfExists(
  supabase: any,
  existingPathOrUrl?: string | null
) {
  if (!existingPathOrUrl) return;

  // Prefer storage path (avatars/uid/filename). If a URL was stored, convert it.
  const toPath = (input: string) => {
    if (input.startsWith('http')) {
      const idx = input.indexOf('/object/public/');
      return idx === -1 ? '' : input.slice(idx + '/object/public/'.length);
    }
    return input;
  };

  const storagePath = toPath(existingPathOrUrl);
  if (!storagePath) return;

  // Ignore not-found
  await supabase.storage.from('avatars').remove([storagePath]).catch(() => {});
}

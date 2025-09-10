import { createClient } from '@supabase/supabase-js';

export async function saveProfile(
  supabase: ReturnType<typeof createClient>,
  user: { id: string; email?: string },
  displayName: string,
  file?: File
) {
  let avatar_url: string | null = null;

  if (file) {
    const path = `${user.id}/avatar-${Date.now()}.png`;
    const { error: uploadErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadErr) throw new Error(`upload: ${uploadErr.message}`);

    const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(path);
    avatar_url = publicUrl?.publicUrl ?? null;
  }

  const { error: upsertErr } = await (supabase as any)
    .from('profiles')
    .upsert(
      {
        id: user.id,
        display_name: displayName || null,
        avatar_url,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (upsertErr) throw new Error(`upsert: ${upsertErr.message}`);
}

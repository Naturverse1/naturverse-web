import { createClient } from '@supabase/supabase-js';

export async function safeUpsertProfile(client: any, values: any) {
  try {
    const { error } = await client.from('profiles').upsert(values, { onConflict: 'id' });
    if (error && !String(error.message || '').includes('duplicate') && error.code !== '409') {
      console.warn('[profile] upsert non-fatal error:', error);
    }
  } catch (err) {
    console.warn('[profile] upsert threw:', err);
  }
}

export async function saveProfile(
  supabase: any,
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

  await safeUpsertProfile(supabase, {
    id: user.id,
    display_name: displayName || null,
    avatar_url,
    updated_at: new Date().toISOString(),
  });
}

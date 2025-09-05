import { createClient } from '@supabase/supabase-js';

export type NavatarRow = {
  id: string;
  user_id: string;
  name: string | null;
  base_type: 'Animal' | 'Fruit' | 'Insect' | 'Spirit';
  backstory: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export async function saveNavatar({
  supabase,
  userId,
  name,
  baseType,
  backstory,
  file,
}: {
  supabase: any;
  userId: string;
  name: string | null;
  baseType: NavatarRow['base_type'];
  backstory: string | null;
  file: File | null;
}) {
  let image_url: string | null = null;

  if (file) {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const objectKey = `navatars/${userId}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await (supabase as any).storage
      .from('avatars')
      .upload(objectKey, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || `image/${ext}`,
      });

    if (upErr) throw new Error(`upload_failed:${upErr.message}`);

    const { data } = (supabase as any).storage.from('avatars').getPublicUrl(objectKey);
    image_url = data.publicUrl;
  }

  const { data: row, error: insErr } = await (supabase as any)
    .from('avatars')
    .insert({
      user_id: userId,
      name,
      base_type: baseType,
      backstory,
      image_url,
    })
    .select()
    .single();

  if (insErr) throw new Error(`insert_failed:${insErr.message}`);
  return row as NavatarRow;
}

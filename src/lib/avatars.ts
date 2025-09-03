import { supabase } from './supabase';

export async function saveNavatarSelection(name: string, image_url: string) {
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) throw new Error('Not signed in');

  // upsert one “primary” per user
  const { error } = await supabase.from('avatars').upsert({
    user_id: user.id,
    name,
    method: 'canon',
    category: 'canon',
    image_url,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });

  if (error) throw error;
}

export async function uploadNavatar(file: File, name = 'avatar') {
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) throw new Error('Not signed in');

  const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
  const up = await supabase.storage.from('avatars').upload(path, file, {
    cacheControl: '3600', upsert: false
  });
  if (up.error) throw up.error;

  // Always persist a public URL so UI shows the image reliably
  const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
  const image_url = pub?.publicUrl;
  if (!image_url) throw new Error('Public URL not available');

  const ins = await supabase.from('avatars').upsert({
    user_id: user.id,
    name,
    method: 'upload',
    category: 'upload',
    image_url,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });

  if (ins.error) throw ins.error;
  return image_url;
}


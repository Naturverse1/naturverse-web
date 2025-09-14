// src/lib/supabaseAvatar.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

// Table shape: public.avatars (user_id unique, name, image_url, image_path, thumbnail_url, appearance_data jsonb, created_at)
export type Avatar = {
  id: string;
  user_id: string;
  name: string | null;
  image_url: string | null;
  image_path: string | null;
  thumbnail_url: string | null;
  appearance_data: any | null;
  created_at: string | null;
};

export async function getSessionUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Not signed in');
  return user;
}

export async function getMyAvatar(): Promise<Avatar | null> {
  const user = await getSessionUser();
  const { data, error } = await supabase
    .from('avatars')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function pickStockAvatar(imgUrl: string, name?: string) {
  const user = await getSessionUser();
  const payload = {
    user_id: user.id,
    image_url: imgUrl,
    image_path: null,
    thumbnail_url: imgUrl,
    name: name ?? 'Me',
    appearance_data: { source: 'stock' }
  };
  const { error } = await supabase
    .from('avatars')
    .upsert(payload, { onConflict: 'user_id' });
  if (error) throw error;
}

export async function uploadAvatar(file: File, name?: string) {
  const user = await getSessionUser();
  const key = `${user.id}/${crypto.randomUUID()}_${file.name}`;
  const { error: upErr } = await supabase.storage
    .from('avatars')
    .upload(key, file, { upsert: true }); // safe to upsert in storage

  if (upErr) throw upErr;

  const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(key);
  const payload = {
    user_id: user.id,
    name: name ?? 'Me',
    image_url: publicUrl.publicUrl,
    image_path: key,
    thumbnail_url: publicUrl.publicUrl,
    appearance_data: { source: 'upload', size: file.size, type: file.type }
  };
  const { error } = await supabase
    .from('avatars')
    .upsert(payload, { onConflict: 'user_id' });
  if (error) throw error;
}

export type CharacterCard = {
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  powers?: string[];
  traits?: string[];
};

export async function saveCharacterCard(card: CharacterCard) {
  const user = await getSessionUser();
  // embed the card into avatars.card (jsonb) to keep single-row model
  const { error } = await supabase
    .from('avatars')
    .update({ appearance_data: { ...(card ?? {}), _type: 'card' } })
    .eq('user_id', user.id);
  if (error) throw error;
}

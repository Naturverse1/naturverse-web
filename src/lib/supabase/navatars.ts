import { supabase } from './client';

export type NavatarItem = { slug: string; label: string; src: string };

export async function getMyNavatar() {
  // Returns the most recent row for this user (if schema differs, adjust column names below)
  const { data: { user }, error: uErr } = await supabase.auth.getUser();
  if (uErr || !user) return null;

  const { data, error } = await supabase
    .from('avatars')
    .select('user_id,label,src,updated_at,created_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn('getMyNavatar error:', error.message);
    return null;
  }
  return data;
}

export async function saveNavatarSelection(label: string, src: string) {
  const { data: { user }, error: uErr } = await supabase.auth.getUser();
  if (uErr || !user) throw new Error('Not signed in');

  // Upsert by user_id only — no assumptions about other columns existing
  const payload: Record<string, any> = {
    user_id: user.id,
    label,
    src
  };

  const { error } = await supabase
    .from('avatars')
    .upsert(payload, { onConflict: 'user_id' });

  if (error) throw new Error(error.message);
}


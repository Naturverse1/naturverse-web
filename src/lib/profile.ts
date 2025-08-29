import { getSupabase } from './supabase-client';

export type Profile = { id: string; display_name?: string | null; avatar_id?: string | null; avatar_url?: string | null };

export async function getProfile(userId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase unavailable');
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error && (error as any).code === 'PGRST116') return null;
  if (error) throw error;
  return data as Profile;
}

export async function upsertProfile(p: Profile) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase unavailable');
  const { data, error } = await supabase.from('profiles').upsert(p).select().single();
  if (error) throw error;
  return data as Profile;
}

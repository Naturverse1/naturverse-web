import { supabase } from './supabase-client';

export type Profile = {
  id: string;
  display_name?: string | null;
  avatar_id?: string | null;
  avatar_url?: string | null;
  updated_at?: string | null;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase!.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function upsertProfile(p: Profile): Promise<Profile> {
  const { data, error } = await supabase!.from('profiles').upsert(p, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return data as Profile;
}

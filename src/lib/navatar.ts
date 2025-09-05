// VITE / React only helpers – no Next imports
import { supabase } from './supabase';

export type NavatarBase = 'Animal' | 'Fruit' | 'Insect' | 'Spirit';

export interface NavatarRow {
  id: string;
  user_id: string;
  name: string | null;
  base_type: NavatarBase;
  backstory: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// safe env guard (prevents white screen when envs are missing)
export function assertSupabaseEnv() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase env not configured');
}

export async function uploadNavatarImage(
  userId: string,
  file: File
): Promise<string> {
  assertSupabaseEnv();
  const ext = file.name.split('.').pop() || 'png';
  const path = `navatars/${userId}/${crypto.randomUUID()}.${ext}`; // inside *avatars* bucket
  const { error } = await supabase.storage.from('avatars').upload(path, file, {
    upsert: false,
    cacheControl: '3600'
  });
  if (error) throw error;
  const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
  return pub.publicUrl;
}

export async function insertNavatar(input: {
  userId: string;
  name: string | null;
  base_type: NavatarBase;
  backstory: string | null;
  image_url: string | null;
}) {
  assertSupabaseEnv();
  const { error } = await supabase.from('avatars').insert({
    user_id: input.userId,
    name: input.name,
    base_type: input.base_type,
    backstory: input.backstory,
    image_url: input.image_url
  });
  if (error) throw error;
}

export async function listMyNavatars(userId: string) {
  assertSupabaseEnv();
  const { data, error } = await supabase
    .from('avatars')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as NavatarRow[];
}

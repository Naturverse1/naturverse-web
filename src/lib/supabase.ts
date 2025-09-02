import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function publicAvatarUrl(path: string) {
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}

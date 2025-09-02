import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL!;
const anon = import.meta.env.PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export function publicAvatarUrl(path: string) {
  // Uses storage public URL helper (bucket is public)
  const { data } = supabase.storage.from('navatars').getPublicUrl(path);
  return data.publicUrl;
}

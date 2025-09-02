import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export async function upsertCanonNavatar(userId: string, name: string, path: string) {
  const { data, error } = await supabase
    .from('avatars')
    .upsert([{ user_id: userId, kind: 'canon', name, path }], { onConflict: 'user_id' })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}


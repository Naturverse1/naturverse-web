import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

if (!url || !anon) {
  // Fail loudly in preview so we see it
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars missing: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(url!, anon!);

export async function getUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// Upsert the selected navatar (no "kind" column assumed)
export async function saveNavatarSelection(label: string, src: string) {
  const user_id = await getUserId();
  if (!user_id) throw new Error('Not logged in');

  const { error } = await supabase
    .from('avatars')
    .upsert(
      { user_id, label, src, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' } // assumes unique index/PK on user_id
    );

  if (error) throw error;
}

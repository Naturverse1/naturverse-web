import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnon, { auth: { persistSession: true } });

/**
 * Upsert the selected navatar for the current user.
 * Table: public.avatars
 * Columns expected: user_id (uuid), label (text), src (text), updated_at (timestamptz default now())
 */
export async function saveNavatarSelection(label: string, src: string) {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error('Not signed in.');

  const payload = { user_id: user.id, label, src };
  const { error } = await supabase
    .from('avatars')
    .upsert(payload, { onConflict: 'user_id' }) // requires unique index on user_id (recommended)
    .eq('user_id', user.id);

  if (error) throw error;
}

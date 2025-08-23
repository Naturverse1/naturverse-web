import { supabase } from './supabaseClient';

export async function upsertProfile(userId: string, email: string | null) {
  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      email,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );
  if (error) console.error('Profile upsert error:', error.message);
}

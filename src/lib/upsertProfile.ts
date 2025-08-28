import { getSupabase } from '@/lib/supabase-client';

export async function upsertProfile(userId: string, email: string | null) {
  const supabase = getSupabase();
  if (!supabase) return;
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

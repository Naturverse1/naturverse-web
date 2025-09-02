import { getSupabase } from '../supabase-client';

/**
 * Save the selected navatar URL for the current user.
 * Upserts into the `avatars` table keyed by user id.
 */
export async function saveNavatarSelection(imageUrl: string) {
  const supabase = getSupabase();
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase
    .from('avatars')
    .upsert({ user_id: user.id, image_url: imageUrl }, { onConflict: 'user_id' });
  if (error) throw error;
}

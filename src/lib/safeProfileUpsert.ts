import { SupabaseClient } from '@supabase/supabase-js';

export async function safeProfileUpsert(
  supabase: SupabaseClient,
  user: { id: string; email?: string | null } | null,
  defaults?: { username?: string; avatar_url?: string }
) {
  if (!user?.id) return; // nothing to do when signed out / unknown

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          username: defaults?.username ?? null,
          avatar_url: defaults?.avatar_url ?? null,
        },
        { onConflict: 'id' }
      );

    if (error) {
      // Log but don't crash: this path is optional in demo
      console.warn('[naturverse] optional profile upsert unavailable (ok in demo):', error);
    }
  } catch (err) {
    console.warn('[naturverse] optional profile upsert unavailable (ok in demo):', err);
  }
}

import { supabase } from './supabase';

export type NavatarPick = { label: string; slug: string; src: string };

export async function saveNavatarSelection(pick: NavatarPick) {
  // Upsert “primary” avatar for the current user.
  // Table: public.avatars
  // Important columns assumed: user_id (set by trigger), label, src, method, is_primary
  const { error } = await supabase
    .from('avatars')
    .upsert(
      { label: pick.label, src: pick.src, method: 'pick', is_primary: true },
      { onConflict: 'user_id' } // enforce one-primary-per-user via unique index
    );

  if (error) throw error;
}

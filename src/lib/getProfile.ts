// Tiny helper to load the current user and their profile row
import { supabase } from '@/lib/supabaseClient';

export type NaturProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
};

export async function getCurrentUserAndProfile() {
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes.user) return { user: null, profile: null, error: userErr ?? null };

  const user = userRes.user;
  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, updated_at')
    .eq('id', user.id)
    .maybeSingle();

  return { user, profile: (profile as NaturProfile | null) ?? null, error: profErr ?? null };
}

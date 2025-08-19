import { getSupabase, SafeSupabase } from "@/lib/supabaseClient";

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const supabase = getSupabase() ?? (SafeSupabase as any);
  if (!supabase) throw new Error('Supabase unavailable');
  const path = `${userId}.png`;
  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}

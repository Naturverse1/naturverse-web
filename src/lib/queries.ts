import { supabase } from '@/lib/supabase-client';

// --------------------
// Profiles
// --------------------
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();
  if (error) throw error;
  return data;
}

// --------------------
// Avatars
// --------------------
export async function createAvatar(navatar: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('avatars')
    .insert(navatar)
    .select();
  if (error) throw error;
  return data;
}

export async function getAvatarsByUser(userId: string) {
  const { data, error } = await supabase
    .from('avatars')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

// --------------------
// Passport Stamps
// --------------------
export async function awardStamp(userId: string, region: string) {
  const { data, error } = await supabase
    .from('stamps')
    .insert({ user_id: userId, region })
    .select();
  if (error) throw error;
  return data;
}

export async function getStamps(userId: string) {
  const { data, error } = await supabase
    .from('stamps')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

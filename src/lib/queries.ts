import { supabase } from '@/lib/supabaseClient';

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
  const payload = { ...navatar } as Record<string, any>;
  if (!payload.user_id && payload.owner_id) {
    payload.user_id = payload.owner_id;
  }
  if (!payload.owner_id && payload.user_id) {
    payload.owner_id = payload.user_id;
  }
  const { data, error } = await supabase
    .from('navatars')
    .insert(payload)
    .select();
  if (error) throw error;
  return data;
}

export async function getAvatarsByUser(userId: string) {
  const { data, error } = await supabase
    .from('navatars')
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

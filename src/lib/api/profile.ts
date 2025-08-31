import { getSupabase } from '@/lib/supabase-client';
import type { Database } from '@/types/db';

type Profile = Database['natur']['Tables']['profiles']['Row']
type ProfileInsert = Database['natur']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['natur']['Tables']['profiles']['Update']

export async function getCurrentUser() {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}

export async function getMyProfile() {
  const supabase = getSupabase();
  const user = await getCurrentUser()
  if (!user || !supabase) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  if (error) throw error
  return data as Profile | null
}

export async function upsertMyProfile(patch: ProfileUpdate | ProfileInsert) {
  const supabase = getSupabase();
  const user = await getCurrentUser()
  if (!user || !supabase) throw new Error('No auth user')
  const row: ProfileInsert = { id: user.id, ...patch }
  const { data, error } = await supabase
    .from('profiles')
    .upsert(row)
    .select()
    .single()
  if (error) throw error
  return data as Profile
}

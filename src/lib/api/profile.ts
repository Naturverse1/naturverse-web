import { supabase } from '../db'
import type { Database } from '../../types/db'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}

export async function getMyProfile() {
  const user = await getCurrentUser()
  if (!user) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  if (error) throw error
  return data as Profile | null
}

export async function upsertMyProfile(patch: ProfileUpdate | ProfileInsert) {
  const user = await getCurrentUser()
  if (!user) throw new Error('No auth user')
  const row: ProfileInsert = { id: user.id, ...patch }
  const { data, error } = await supabase
    .from('profiles')
    .upsert(row)
    .select()
    .single()
  if (error) throw error
  return data as Profile
}

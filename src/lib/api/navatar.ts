import { supabase } from '../db'
import type { Database } from '../../types/db'

type Navatar = Database['public']['Tables']['navatars']['Row']
type NavatarInsert = Database['public']['Tables']['navatars']['Insert']
type NavatarUpdate = Database['public']['Tables']['navatars']['Update']

export async function listMyAvatars() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('navatars')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Navatar[]
}

export async function createAvatar(input: NavatarInsert) {
  const payload: NavatarInsert = { ...input };
  if (!payload.user_id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not signed in');
    payload.user_id = user.id;
  }
  const { data, error } = await supabase
    .from('navatars')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data as Navatar
}

export async function updateAvatar(id: string, patch: NavatarUpdate) {
  const { data, error } = await supabase
    .from('navatars')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Navatar
}

import { supabase } from '../db'
import type { Database } from '../../types/db'

type Avatar = Database['public']['Tables']['avatars']['Row']
type AvatarInsert = Database['public']['Tables']['avatars']['Insert']
type AvatarUpdate = Database['public']['Tables']['avatars']['Update']

export async function listMyAvatars() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('avatars')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Avatar[]
}

export async function createAvatar(input: AvatarInsert) {
  const { data, error } = await supabase
    .from('avatars')
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data as Avatar
}

export async function updateAvatar(id: string, patch: AvatarUpdate) {
  const { data, error } = await supabase
    .from('avatars')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Avatar
}

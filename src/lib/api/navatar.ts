import { supabase } from '../db'
import type { Database } from '../../types/db'

type Navatar = Database['public']['Tables']['navatars']['Row']
type NavatarInsert = Database['public']['Tables']['navatars']['Insert']
type NavatarUpdate = Database['public']['Tables']['navatars']['Update']

function normalizeOwnershipFields<T extends { owner_id?: string | null; user_id?: string | null }>(
  input: T
) {
  const userId = input.user_id ?? input.owner_id
  if (!userId) throw new Error('user_id is required')
  return {
    ...input,
    user_id: userId,
    owner_id: input.owner_id ?? userId,
  }
}

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
  const payload = normalizeOwnershipFields(input)
  const { data, error } = await supabase
    .from('navatars')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data as Navatar
}

export async function updateAvatar(id: string, patch: NavatarUpdate) {
  const payload =
    patch.user_id !== undefined || patch.owner_id !== undefined
      ? normalizeOwnershipFields(patch)
      : patch
  const { data, error } = await supabase
    .from('navatars')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Navatar
}

import { supabase } from '../db'
import type { Database } from '../../types/db'

type Navatar = Database['natur']['Tables']['avatars']['Row']
type NavatarInsert = Database['natur']['Tables']['avatars']['Insert']
type NavatarUpdate = Database['natur']['Tables']['avatars']['Update']

export async function listMyNavatars() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await (supabase as any)
    .from('avatars')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Navatar[]
}

export async function createNavatar(input: NavatarInsert) {
  const { data, error } = await (supabase as any)
    .from('avatars')
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data as Navatar
}

export async function updateNavatar(id: string, patch: NavatarUpdate) {
  const { data, error } = await (supabase as any)
    .from('avatars')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Navatar
}

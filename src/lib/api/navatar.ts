import { supabase } from '@/lib/supabase-client';
import type { Database } from '@/types/db';

type Navatar = Database['natur']['Tables']['navatars']['Row']
type NavatarInsert = Database['natur']['Tables']['navatars']['Insert']
type NavatarUpdate = Database['natur']['Tables']['navatars']['Update']

export async function listMyNavatars() {
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

export async function createNavatar(input: NavatarInsert) {
  const { data, error } = await supabase
    .from('navatars')
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data as Navatar
}

export async function updateNavatar(id: string, patch: NavatarUpdate) {
  const { data, error } = await supabase
    .from('navatars')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Navatar
}

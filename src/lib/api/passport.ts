import { supabase } from '../db'
import type { Database } from '../../types/db'

type Stamp = Database['public']['Tables']['passport_stamps']['Row']

export async function listMyStamps() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data, error } = await supabase
    .from('passport_stamps')
    .select('*')
    .eq('user_id', user.id)
    .order('stamped_at', { ascending: false })
  if (error) throw error
  return data as Stamp[]
}

export async function toggleStamp(kingdom: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No auth user')

  // if exists -> delete, else -> insert
  const { data: existing } = await supabase
    .from('passport_stamps')
    .select('id')
    .eq('user_id', user.id)
    .eq('kingdom', kingdom)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase.from('passport_stamps')
      .delete()
      .eq('id', existing.id)
    if (error) throw error
    return { action: 'removed' as const }
  } else {
    const { error } = await supabase.from('passport_stamps')
      .insert({ user_id: user.id, kingdom })
    if (error) throw error
    return { action: 'added' as const }
  }
}

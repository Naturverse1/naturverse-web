import { supabase } from '../db'

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
  return data
}

export async function upsertMyProfile(partial: {
  username?: string
  full_name?: string
  avatar_url?: string
}) {
  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  if (userErr || !user) throw new Error('Not signed in')

  const row = { id: user.id, ...partial }

  const { error } = await supabase
    .from('profiles')
    .upsert(row as any, { onConflict: 'id' })
  if (error) throw error
  return true
}

// src/lib/navatars.ts
import { createClient } from '@supabase/supabase-js'

export type AvatarRow = {
  id: string
  user_id: string | null
  name: string | null
  category: string | null
  appearance_data: any | null
  image_url: string | null
  method: 'upload' | 'canon' | 'generate'
  created_at: string | null
  storage_path?: string | null // optional helper for display
}

export const supabaseBrowser = () =>
  createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  )

export async function getUser() {
  const supabase = supabaseBrowser()
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}

export async function listMyAvatars(): Promise<AvatarRow[]> {
  const supabase = supabaseBrowser()
  const user = await getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('avatars')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  // normalize image urls (signed/public or canon)
  const withUrls = data.map((row) => {
    if (!row.image_url) return row

    if (row.image_url.startsWith('/navatars/')) {
      return row // canon asset from /public
    }

    // assume storage path; convert to public URL
    const { data: pub } = supabase.storage
      .from('avatars')
      .getPublicUrl(row.image_url)
    return { ...row, storage_path: row.image_url, image_url: pub.publicUrl }
  })

  return withUrls as any
}

export async function insertAvatar(input: {
  name: string
  category: string
  method: 'upload' | 'canon' | 'generate'
  image_url: string
}) {
  const supabase = supabaseBrowser()
  const user = await getUser()
  if (!user) throw new Error('Not signed in')

  const { data, error } = await supabase
    .from('avatars')
    .insert({
      user_id: user.id,
      name: input.name,
      category: input.category,
      image_url: input.image_url,
      method: input.method,
    })
    .select()
    .single()

  if (error) throw error
  return data as AvatarRow
}

export async function deleteAvatar(id: string) {
  const supabase = supabaseBrowser()
  await supabase.from('avatars').delete().eq('id', id)
}

export async function setPrimaryAvatar(row: AvatarRow) {
  const supabase = supabaseBrowser()
  const user = await getUser()
  if (!user) throw new Error('Not signed in')

  // store both the display URL and the storage path (if present)
  const avatar_url = row.image_url ?? ''
  const avatar_path = row.storage_path ?? row.image_url ?? ''

  await supabase.from('users').update({ avatar_url, avatar_path }).eq('id', user.id)
}

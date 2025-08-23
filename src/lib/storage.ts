import { supabase } from './db'

export async function uploadAvatar(file: File, path: string) {
  // Bucket policies created earlier allow user-specific write
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data: url } = supabase.storage.from('avatars').getPublicUrl(data.path)
  return url.publicUrl
}

export async function uploadNavatarImage(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('navatars')
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data: url } = supabase.storage.from('navatars').getPublicUrl(data.path)
  return url.publicUrl
}

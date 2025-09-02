import { supabase } from '@/lib/supabase'
import { v4 as uuid } from 'uuid'

const BUCKET = 'navatars'
const USE_SIGNED = false // set true if you make bucket private

export async function listNavatars() {
  const { data, error } = await supabase
    .from('avatars')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function deleteNavatar(id: string) {
  const { error } = await supabase.from('avatars').delete().eq('id', id)
  if (error) throw error
}

export async function createFromUpload(file: File, name?: string) {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('Not signed in')

  const key = `${user.id}/${uuid()}.${file.type.includes('png') ? 'png' : 'jpg'}`
  const up = await supabase.storage.from(BUCKET).upload(key, file, { upsert: false })
  if (up.error) throw up.error

  let image_url: string
  if (USE_SIGNED) {
    const signed = await supabase.storage.from(BUCKET).createSignedUrl(key, 60 * 60 * 24 * 30)
    if (signed.error) throw signed.error
    image_url = signed.data.signedUrl
  } else {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(key)
    image_url = data.publicUrl
  }

  const ins = await supabase.from('avatars')
    .insert({ user_id: user.id, name: name || null, method: 'upload', image_url })
    .select().single()
  if (ins.error) throw ins.error
  return ins.data
}

export async function createFromCanon(image_url: string, name?: string) {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('Not signed in')
  const ins = await supabase.from('avatars')
    .insert({ user_id: user.id, name: name || null, method: 'canon', image_url })
    .select().single()
  if (ins.error) throw ins.error
  return ins.data
}

export async function createFromAI(prompt: string, name?: string) {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('Not signed in')

  const res = await fetch('/.netlify/functions/create-navatar', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-user-id': user.id,
    },
    body: JSON.stringify({ prompt, name }),
  })

  // Always parse safely; backend ALWAYS returns JSON
  const text = await res.text()
  let payload: any = {}
  try { payload = text ? JSON.parse(text) : {} } catch { /* keep empty */ }

  if (!res.ok || payload?.error) {
    throw new Error(payload?.message || payload?.error || `Generate failed (${res.status})`)
  }
  return payload
}


import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY as string

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

export const handler: Handler = async (evt) => {
  if (evt.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  try {
    const payload = JSON.parse(evt.body || '{}')
    const { error } = await supabase.from('client_logs').insert({
      type: payload.type || 'event',
      name: payload.name || 'unknown',
      data: payload.data || null,
      path: payload.path || null,
      ua: payload.ua || null,
      ts: payload.ts || new Date().toISOString()
    })
    if (error) throw error
    return { statusCode: 200, body: 'ok' }
  } catch (err: any) {
    return { statusCode: 500, body: String(err?.message || err) }
  }
}

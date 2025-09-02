import type { Handler } from '@netlify/functions'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side only
)

function json(status: number, body: any) {
  return {
    statusCode: status,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' })

  try {
    const { name = 'avatar', prompt = '' } = JSON.parse(event.body || '{}')

    if (!prompt.trim()) return json(400, { error: 'Missing prompt' })

    // Create image with OpenAI (NO response_format param)
    const img = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
    })

    const b64 = img.data?.[0]?.b64_json
    if (!b64) return json(502, { error: 'Image generation failed' })

    const bytes = Buffer.from(b64, 'base64')

    // Upload to Supabase storage (avatars bucket)
    const fileName = `${Date.now()}-${name.replace(/\W+/g, '-').toLowerCase()}.png`
    const path = `ai/${fileName}`

    const { error: upErr } = await supabase.storage.from('avatars').upload(path, bytes, {
      contentType: 'image/png',
      upsert: false,
    })
    if (upErr) return json(502, { error: `Upload failed: ${upErr.message}` })

    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path)
    const publicUrl = pub?.publicUrl
    if (!publicUrl) return json(500, { error: 'Could not resolve public URL' })

    // Insert DB row
    const { data: avatar, error: dbErr } = await supabase
      .from('avatars')
      .insert({
        name,
        method: 'ai',
        image_url: publicUrl,
        appearance_data: { source: 'ai', path },
      })
      .select()
      .single()

    if (dbErr) return json(502, { error: `DB insert failed: ${dbErr.message}` })

    return json(200, { ok: true, avatar })
  } catch (e: any) {
    // Handle common OpenAI 403 (org not verified)
    const msg = String(e?.message || e)
    if (/gpt-image-1/i.test(msg) || /403/.test(msg)) {
      return json(403, {
        error:
          '403: Your OpenAI org must be verified to use gpt-image-1. Visit OpenAI org settings to verify (propagation can take ~15 min).',
      })
    }
    return json(500, { error: `Unexpected: ${msg}` })
  }
}

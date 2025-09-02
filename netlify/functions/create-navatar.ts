import type { Handler } from '@netlify/functions'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuid } from 'uuid'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  // Project scoping is optional; include if you set it in env
  // project: process.env.OPENAI_PROJECT_ID,
})

function json(status: number, body: any) {
  return {
    statusCode: status,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return json(405, { error: 'method_not_allowed' })

    const userId = event.headers['x-user-id'] // frontend passes supabase.auth.user().id
    if (!userId) return json(400, { error: 'missing_user_id' })

    const { name, prompt } = JSON.parse(event.body || '{}') as {
      name?: string
      prompt: string
    }
    if (!prompt?.trim()) return json(400, { error: 'missing_prompt' })

    // ---- 1) Call OpenAI Images via Responses (image content) ----
    // Using Images API compatible output (base64)
    const res = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
      // IMPORTANT: do NOT set response_format in new SDKs; it throws 400 in newer APIs.
    })

    const b64 = res.data?.[0]?.b64_json
    if (!b64) return json(502, { error: 'openai_failed', message: 'No image bytes returned' })

    // ---- 2) Upload bytes to Supabase Storage ----
    const bytes = Buffer.from(b64, 'base64')
    const fileId = uuid()
    const path = `${userId}/${fileId}.jpg`

    const upload = await supabase.storage.from('navatars').upload(path, bytes, {
      contentType: 'image/jpeg',
      upsert: false,
    })
    if (upload.error) {
      return json(500, { error: 'storage_upload_failed', message: upload.error.message })
    }

    // Public URL (flip to signed if you make bucket private)
    const { data: pub } = supabase.storage.from('navatars').getPublicUrl(path)
    const image_url = pub.publicUrl

    // ---- 3) Insert avatars row ----
    const insert = await supabase.from('avatars').insert({
      user_id: userId,
      name: name?.trim() || null,
      method: 'ai',
      image_url,
    }).select().single()

    if (insert.error) {
      return json(500, { error: 'db_insert_failed', message: insert.error.message })
    }

    return json(200, {
      ok: true,
      id: insert.data.id,
      name: insert.data.name,
      image_url,
    })
  } catch (err: any) {
    // Always return JSON
    return json(500, { error: 'internal', message: err?.message || 'Unknown error' })
  }
}


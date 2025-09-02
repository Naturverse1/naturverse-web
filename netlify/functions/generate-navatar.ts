import type { Handler } from '@netlify/functions'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' }
    }

    const { prompt, name, userId } = JSON.parse(event.body || '{}') as {
      prompt: string
      name?: string
      userId: string
    }

    if (!prompt || !userId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing prompt or userId' }) }
    }

    // Generate image (IMPORTANT: no response_format here)
    const img = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
      n: 1
    })

    const b64 = img.data?.[0]?.b64_json
    if (!b64) {
      return { statusCode: 502, body: JSON.stringify({ error: 'Image generation returned no data' }) }
    }

    const binary = Buffer.from(b64, 'base64')

    // Upload to Supabase Storage (server role key)
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const fileName = `${crypto.randomUUID()}.png`
    const { error: uploadErr } = await supabase.storage
      .from('avatars')
      .upload(fileName, binary, { contentType: 'image/png', upsert: false })
    if (uploadErr) {
      return { statusCode: 500, body: JSON.stringify({ error: `Upload failed: ${uploadErr.message}` }) }
    }

    const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(fileName)

    // Insert DB row
    const { error: dbErr } = await supabase.from('avatars').insert({
      user_id: userId,
      name: name || 'Navatar',
      category: 'ai',
      image_url: publicUrl.publicUrl,
      method: 'ai'
    })
    if (dbErr) {
      return { statusCode: 500, body: JSON.stringify({ error: `DB insert failed: ${dbErr.message}` }) }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, url: publicUrl.publicUrl }) }
  } catch (e: any) {
    return { statusCode: 500, body: JSON.stringify({ error: e?.message || 'Unknown error' }) }
  }
}

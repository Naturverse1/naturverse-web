// netlify/functions/generate-navatar.ts
import type { Handler } from '@netlify/functions'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const supabase = createClient(
  process.env.SUPABASE_URL!,
  // Use service role on server so we can write to storage securely
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' }
    }

    const { userId, name, prompt } = JSON.parse(event.body || '{}') as {
      userId: string
      name?: string
      prompt: string
    }

    if (!userId || !prompt) {
      return { statusCode: 400, body: 'userId and prompt are required' }
    }

    // 1) Generate image with OpenAI (single good image)
    const result = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: `Cute, brand-friendly character for "The Naturverse". SVG or PNG-like style, clean silhouette, merch-friendly. ${prompt}`,
      size: '1024x1024',
      n: 1,
    })

    const b64 = result.data?.[0]?.b64_json
    if (!b64) {
      return { statusCode: 502, body: 'Image generation failed' }
    }
    const buffer = Buffer.from(b64, 'base64')

    // 2) Store in Supabase Storage
    const fileName = `${crypto.randomUUID()}.png`
    const path = `${userId}/${fileName}`

    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, buffer, {
        contentType: 'image/png',
        upsert: false,
      })

    if (upErr) {
      console.error(upErr)
      return { statusCode: 500, body: 'Upload failed' }
    }

    // 3) Return storage path (client will insert DB row)
    return {
      statusCode: 200,
      body: JSON.stringify({ path, suggestedName: name ?? 'Navatar' }),
    }
  } catch (e: any) {
    console.error(e)
    // Surface common OpenAI billing/limit messages cleanly
    const msg =
      e?.error?.message ||
      e?.response?.data?.error?.message ||
      e?.message ||
      'Server error'
    return { statusCode: 500, body: JSON.stringify({ error: msg }) }
  }
}

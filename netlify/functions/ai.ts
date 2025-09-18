import type { Handler } from '@netlify/functions'
import { z } from 'zod'

const MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant' // safe default

const HEADERS = {
  'content-type': 'application/json',
  'access-control-allow-origin': '*',
}

const Quiz = z.object({
  questions: z.array(z.object({
    q: z.string(),
    options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
    answer: z.enum(['A','B','C','D'])
  })).length(3)
})

const Card = z.object({
  name: z.string(),
  species: z.string(),
  kingdom: z.string(),
  backstory: z.string(),
  powers: z.array(z.string()).default([]),
  traits: z.array(z.string()).default([]),
})

type Action = 'lesson' | 'quiz' | 'card'
type Body = { action: Action; prompt: string }

const systemByAction: Record<Action,string> = {
  lesson:
    'You are Turian. Create a short kid-friendly lesson (title, intro, outline[3 bullets], activities[2]). Return ONLY JSON: {title, intro, outline:[...], activities:[...]}',
  quiz:
    'You are Turian. Create 3 multiple-choice (A–D) questions for kids about the given topic and age. Return ONLY JSON: {questions:[{q, options:[A,B,C,D], answer}]}',
  card:
    'You are Turian. Turn the description into a friendly character card. Return ONLY JSON: {name, species, kingdom, backstory, powers[], traits[]}. Powers/traits should be single words.',
}

function pickJson(text: string) {
  const m = text.match(/\{[\s\S]*\}$/)
  return m ? m[0] : text // best effort
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error:'Method not allowed' }) }
  }

  let body: Body
  try { body = JSON.parse(event.body || '{}') } 
  catch { return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error:'Bad JSON' }) } }

  const { action, prompt } = body
  if (!action || !prompt) {
    return { statusCode: 422, headers: HEADERS, body: JSON.stringify({ error:'Missing action or prompt' }) }
  }

  // call Groq
  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${process.env.GROQ_API_KEY!}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemByAction[action] },
        { role: 'user', content: prompt.trim() }
      ],
      temperature: 0.4,
      max_tokens: 1024
    })
  })

  const text = await resp.text()
  if (!resp.ok) {
    // forward Groq’s actual error message so the client can show it
    return { statusCode: resp.status, headers: HEADERS, body: text }
  }

  // extract + validate
  const data = JSON.parse(pickJson(JSON.parse(text).choices[0].message.content))
  try {
    if (action === 'quiz') Quiz.parse(data)
    if (action === 'card') Card.parse(data)
  } catch (e) {
    return { statusCode: 422, headers: HEADERS, body: JSON.stringify({ error:'Bad AI JSON', detail: (e as Error).message, raw:data }) }
  }

  return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok:true, data }) }
}

export default handler

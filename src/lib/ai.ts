export type AiAction = 'lesson' | 'quiz' | 'card'

type AiSuccess<T> = { ok: true; data: T }
type AiError = { ok?: false; error?: string | { message?: string } }

type AiEnvelope<T> = AiSuccess<T> | AiError | null

function safeJson<T>(input: string): T | null {
  try {
    return JSON.parse(input) as T
  } catch {
    return null
  }
}

function extractError(payload: AiEnvelope<unknown>, fallback: string) {
  if (!payload) return fallback
  const raw = (payload as AiError).error
  if (!raw) return fallback
  if (typeof raw === 'string') return raw
  if (typeof raw.message === 'string' && raw.message.trim().length > 0) return raw.message
  return fallback
}

export async function callAI<T>(action: AiAction, prompt: string): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch('/.netlify/functions/ai', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action, prompt }),
      signal: controller.signal,
    })

    const text = await response.text()
    const json = safeJson<AiEnvelope<T>>(text)

    if (!response.ok || !json || json.ok !== true) {
      const message = extractError(json, text || `AI failed (${response.status})`)
      throw new Error(message)
    }

    return json.data
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('AI request timed out')
    }
    throw error instanceof Error ? error : new Error('AI request failed')
  } finally {
    clearTimeout(timeout)
  }
}

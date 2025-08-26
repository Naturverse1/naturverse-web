export type Flags = {
  enableTurianAI: boolean
  showCreatorLab: boolean
  enablePWAInstallPrompt: boolean
  enableAnimations: boolean
  enableShareButton: boolean
  [k: string]: any
}

let cached: Flags | null = null

export async function getFlags(): Promise<Flags> {
  if (cached) return cached
  const res = await fetch('/flags.json', { cache: 'no-store' }).catch(()=>null)
  const remote = (await res?.json().catch(()=>null)) || {}
  const fromEnv = parseEnvFlags(import.meta.env.VITE_FLAGS)
  const local = parseEnvFlags(localStorage.getItem('naturverse_flags') || '')
  cached = { ...remote, ...fromEnv, ...local } as Flags
  return cached
}

function parseEnvFlags(s?: string | any) {
  try { return typeof s === 'string' ? JSON.parse(s) : (s || {}) } catch { return {} }
}

export function setLocalFlag(k: string, v: any) {
  const current = parseEnvFlags(localStorage.getItem('naturverse_flags') || '{}')
  current[k] = v
  localStorage.setItem('naturverse_flags', JSON.stringify(current))
  cached = null
}

export async function flag(k: keyof Flags, fallback=false){
  const f = await getFlags()
  return (f[k] ?? fallback) as boolean
}

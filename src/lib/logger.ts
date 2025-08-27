type Event = { type: 'event'|'error'; name: string; data?: any; ts?: string; path?: string; ua?: string }

export async function logEvent(name: string, data?: any){
  const e: Event = { type:'event', name, data, ts:new Date().toISOString(), path: location.pathname, ua: navigator.userAgent }
  output(e)
}

export async function logError(name: string, data?: any){
  const e: Event = { type:'error', name, data, ts:new Date().toISOString(), path: location.pathname, ua: navigator.userAgent }
  output(e)
}

async function output(e: Event){
  if (import.meta.env.DEV) {
    console[e.type === 'error' ? 'error' : 'log']('[nv]', e)
    return
  }
  try {
    fetch('/.netlify/functions/event-collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(e)
    })
  } catch {
    // ignore errors
  }
}

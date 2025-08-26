import { useEffect } from 'react'

export default function Analytics(){
  useEffect(()=>{
    if (import.meta.env.DEV) return
    const provider = (import.meta.env.VITE_ANALYTICS_PROVIDER || 'plausible').toLowerCase()
    const domain   = import.meta.env.VITE_ANALYTICS_DOMAIN
    if (!domain) return

    const s = document.createElement('script')
    if (provider === 'umami') {
      s.defer = true
      s.setAttribute('data-website-id', import.meta.env.VITE_UMAMI_WEBSITE_ID || '')
      s.src = import.meta.env.VITE_UMAMI_SRC || 'https://umami.naturverse.com/script.js'
    } else {
      s.defer = true
      s.setAttribute('data-domain', domain)
      s.src = 'https://plausible.io/js/script.js'
    }
    document.head.appendChild(s)
    return ()=>{ document.head.removeChild(s) }
  },[])
  return null
}

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase-client'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        // Works for both hash (#access_token…) and PKCE (?code=…)
        await supabase.auth.getSessionFromUrl({ storeSession: true })
      } catch (e) {
        // optional: show a toast
      } finally {
        navigate('/', { replace: true })
      }
    })()
  }, [navigate])

  return <div style={{ padding: 24 }}>Signing you in…</div>
}

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase-client'

export default function AuthCallback() {
  const navigate = useNavigate()
  useEffect(() => {
    ;(async () => {
      try {
        // Handles both #access_token and ?code flows
        await supabase.auth.getSessionFromUrl({ storeSession: true })
      } catch {}
      navigate('/', { replace: true })
    })()
  }, [navigate])
  return <div style={{ padding: 24 }}>Signing you in…</div>
}

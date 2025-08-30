import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        await supabase.auth.getSession()
      } finally {
        navigate('/', { replace: true })
      }
    })()
  }, [navigate])

  return <div style={{ padding: 24 }}>Signing you in…</div>
}

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const nav = useNavigate()

  useEffect(() => {
    // Supabase parses the URL hash and sets the session
    supabase.auth.getSession().finally(() => {
      // Optionally, read redirect-to from state; default home:
      nav('/', { replace: true })
    })
  }, [nav])

  return <div style={{ padding: 24 }}>Signing you in…</div>
}

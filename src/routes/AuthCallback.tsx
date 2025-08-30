import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  { auth: { persistSession: true, detectSessionInUrl: true } }
)

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // detectSessionInUrl above will parse #access_token and set the session
    supabase.auth.getSession().then(() => navigate('/', { replace: true }))
  }, [navigate])

  return <div style={{padding: 24}}>Signing you in…</div>
}

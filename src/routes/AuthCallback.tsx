import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase parses the hash fragment internally; we just wait for a session.
    // If needed, you can call getSession() in a loop briefly.
    let mounted = true
    ;(async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (mounted) navigate('/', { replace: true })
      } catch {
        if (mounted) navigate('/', { replace: true })
      }
    })()
    return () => {
      mounted = false
    }
  }, [navigate])

  return null
}

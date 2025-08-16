
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href)
        const hasCode = url.searchParams.get('code')
        if (hasCode) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
          if (error) throw error
        } else if (url.hash.includes('access_token') && url.hash.includes('refresh_token')) {
          const params = new URLSearchParams(url.hash.slice(1))
          const access_token = params.get('access_token')!
          const refresh_token = params.get('refresh_token')!
          const { error } = await supabase.auth.setSession({ access_token, refresh_token })
          if (error) throw error
        }
        const next = localStorage.getItem('postLoginPath') || '/'
        localStorage.removeItem('postLoginPath')
        navigate(next, { replace: true })
      } catch (e: any) {
        alert(e.message || 'Sign-in failed')
        navigate('/login', { replace: true })
      }
    })()
  }, [navigate])

  return <p>Signing you in…</p>
}

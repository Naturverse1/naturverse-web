import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Handle hash tokens from Supabase OAuth
    const { hash, search } = window.location
    if (hash && hash.includes('access_token')) {
      // Store or let your auth layer parse directly; this just verifies then redirects.
      sessionStorage.setItem('nv-auth-hash', hash)
      navigate('/', { replace: true })
    } else if (search && search.includes('code=')) {
      // PKCE/code flow case
      navigate('/', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [navigate])

  return <div style={{ padding: 24 }}>Signing you in…</div>
}

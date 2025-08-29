import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase-client'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Parse tokens from the hash and set session, then bounce home.
    // Works for both ? and # token delivery.
    supabase!
      .auth
      .getSession()
      .finally(() => {
        // Use replace so /auth/callback never stays in history.
        window.location.replace('/')
      })
  }, [])

  return null
}

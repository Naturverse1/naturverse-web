import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    supabase.auth.getUser().then(({ data }) => {
      if (!ignore) {
        setUser(data.user ?? null)
        setLoading(false)
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_ev, sess) => {
      setUser(sess?.user ?? null)
    })

    return () => {
      ignore = true
      sub.subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { useSupabase } from '@/lib/useSupabase'
import { ensureNavatarOnFirstLogin } from '@/lib/auth-gating'

export function useAuth() {
  const supabase = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!ignore) {
        setUser(data.user ?? null)
        if (data.user) ensureNavatarOnFirstLogin(data.user.id)
        setLoading(false)
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_ev, sess) => {
      setUser(sess?.user ?? null)
      if (sess?.user) ensureNavatarOnFirstLogin(sess.user.id)
    })

    return () => {
      ignore = true
      sub.subscription.unsubscribe()
    }
  }, [supabase])

  return { user, loading }
}

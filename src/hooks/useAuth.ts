import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { useSupabase } from '@/lib/useSupabase'

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
  }, [supabase])

  return { user, loading }
}

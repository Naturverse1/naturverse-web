
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '@/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const loc = useLocation()

  async function sendLink() {
    const next = (loc.state as any)?.from ?? '/'
    localStorage.setItem('postLoginPath', next)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) alert(error.message)
    else setSent(true)
  }

  return (
    <div>
      <h1>Sign in</h1>
      {sent ? (
        <p>Check your email for the magic link.</p>
      ) : (
        <div>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <button onClick={sendLink}>Send magic link</button>
        </div>
      )}
    </div>
  )
}

import { useState } from "react";
import { supabase } from '@/supabaseClient';
export default function Login() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + "/auth/callback" }});
    setLoading(false);
    if (error) {
      setMsg(error.message);
      alert("Failed to send magic link: " + error.message);
    } else {
      setMsg("Check your email for the magic link!");
      alert("Check your email for the magic link!");
    }
  };
  return (
    <main style={{padding:"2rem"}}>
      <h1>Sign in</h1>
      <form onSubmit={onSubmit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send magic link"}</button>
      </form>
      {msg && <p>{msg}</p>}
    </main>
  );
}

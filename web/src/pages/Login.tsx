import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../env";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default function Login() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + "/app" }});
    setMsg(error ? error.message : "Check your email for the magic link!");
  };
  return (
    <main style={{padding:"2rem"}}>
      <h1>Sign in</h1>
      <form onSubmit={onSubmit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <button type="submit">Send magic link</button>
      </form>
      {msg && <p>{msg}</p>}
    </main>
  );
}

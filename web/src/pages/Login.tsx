import { useState } from "react";
import { supabase } from "@/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setMsg(null);
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    setSending(false);
    if (error) { setMsg(error.message); return; }
    setMsg("Magic link sent! Check your email.");
  }

  return (
    <div className="page">
      <h1>Sign in</h1>
      <form onSubmit={sendLink}>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />
        <button disabled={sending}>{sending ? "Sending…" : "Send magic link"}</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}

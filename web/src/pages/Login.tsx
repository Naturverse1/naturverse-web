import React from "react";
import { supabase } from "@/supabaseClient";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [sending, setSending] = React.useState(false);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/callback` }});
    setSending(false);
    if (error) alert(error.message);
    else alert("Magic link sent!");
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-4">Sign in</h1>
      <form onSubmit={sendLink} className="space-y-3">
        <input
          className="w-full rounded-md border border-white/20 bg-black/30 p-2 text-white"
          placeholder="you@example.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          type="email"
          required
        />
        <button disabled={sending} className="w-full rounded-md bg-sky-500/90 py-2 font-semibold">
          {sending ? "Sending…" : "Send magic link"}
        </button>
      </form>
    </main>
  );
}

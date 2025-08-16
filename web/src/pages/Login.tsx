import React, { useEffect, useState } from "react";
import { supabase } from '@/supabaseClient';
export default function Login() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    localStorage.setItem("postLoginPath", "/");
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: "https://thenaturverse.com/auth/callback" }});
    setLoading(false);
    setCooldown(10);
    if (error) {
      if (error.message.toLowerCase().includes("wait")) {
        setMsg("Please wait a few seconds before requesting another link.");
      } else {
        setMsg(error.message);
      }
    } else {
      setMsg("Check your email for the magic link!");
    }
  };
  return (
    <main style={{padding:"2rem"}}>
      <h1>Sign in</h1>
      <form onSubmit={onSubmit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
  <button type="submit" disabled={loading || cooldown > 0}>{loading ? "Sending..." : cooldown > 0 ? `Wait ${cooldown}s` : "Send magic link"}</button>
      </form>
  {msg && <p>{msg}</p>}
    </main>
  );
}

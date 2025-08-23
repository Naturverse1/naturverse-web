import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthButton() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.session?.user?.email ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <span style={{ opacity: 0.6 }}>…</span>;

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/login` },
    });
  }
  async function signOut() {
    await supabase.auth.signOut();
    window.location.assign("/");
  }

  return email ? (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <a href="/profile" title="Profile">{email.split("@")[0]}</a>
      <button className="btn sm" onClick={signOut}>Sign out</button>
    </div>
  ) : (
    <button className="btn sm" onClick={signIn}>Sign in</button>
  );
}


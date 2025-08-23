import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/profile",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  if (session?.user) {
    return (
      <div style={{ maxWidth: 560, margin: "2rem auto", textAlign: "center" }}>
        <h1>You&apos;re signed in 🎉</h1>
        <p style={{ marginTop: 8 }}>Welcome, {session.user.email}</p>
        <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
          <a href="/profile"><button>Go to Profile</button></a>
          <button onClick={signOut} disabled={loading}>Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: "2rem auto", textAlign: "center" }}>
      <h1>Sign in</h1>
      <p className="muted" style={{ marginTop: 6 }}>Use Google to continue.</p>
      <div style={{ marginTop: 20 }}>
        <button onClick={signInWithGoogle} disabled={loading}>
          {loading ? "Redirecting…" : "Continue with Google"}
        </button>
      </div>
      <div style={{ marginTop: 24 }}>
        <a href="/"><button className="btn outline">Back Home</button></a>
      </div>
    </div>
  );
}


import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type UserInfo = {
  id: string;
  email: string | null;
  avatar_url?: string | null;
  display_name?: string | null;
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load current user (if any)
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        setLoading(true);
        const { data, error: getUserErr } = await supabase.auth.getUser();
        if (getUserErr) throw getUserErr;

        const sUser = data.user;
        if (!sUser) {
          if (mounted) setUser(null);
          return;
        }

        // Pull any profile fields you keep in your public "profiles" table.
        // This is optional—if you don’t have it yet, we’ll just display email.
        const { data: prof } = await supabase
          .from("profiles")
          .select("display_name, avatar_url")
          .eq("id", sUser.id)
          .maybeSingle();

        if (mounted) {
          setUser({
            id: sUser.id,
            email: sUser.email ?? null,
            avatar_url: prof?.avatar_url ?? null,
            display_name: prof?.display_name ?? null,
          });
        }
      } catch (e: any) {
        if (mounted) setError(e.message ?? "Failed to load user.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();
    // keep session in sync (optional but nice)
    const { data: sub } = supabase.auth.onAuthStateChange(() => init());

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    setError(null);
    try {
      setLoading(true);
      const { error: authErr } = await supabase.auth.signInWithOAuth({
        provider: "google",
        // after OAuth completes, come back to profile
        options: { redirectTo: window.location.origin + "/profile" },
      });
      if (authErr) throw authErr;
    } catch (e: any) {
      setError(e.message ?? "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setError(null);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (e: any) {
      setError(e.message ?? "Sign-out failed.");
    }
  }

  return (
    <main id="main" className="page-wrap" style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1>Profile</h1>

      {loading && <p>Loading…</p>}
      {error && (
        <p role="alert" style={{ color: "#b00020", fontWeight: 600 }}>
          {error}
        </p>
      )}

      {!loading && !user && (
        <section style={{ marginTop: 16 }}>
          <p>You’re not signed in.</p>
          <button onClick={signInWithGoogle}>Continue with Google</button>
        </section>
      )}

      {!loading && user && (
        <section style={{ marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                width={56}
                height={56}
                style={{ borderRadius: 8, objectFit: "cover" }}
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>
                {user.display_name || "Explorer"}
              </div>
              <div style={{ opacity: 0.8 }}>{user.email}</div>
            </div>
          </div>

          {/* Your existing profile UI can remain below.
              This block is additive and safe. */}
          <div style={{ marginTop: 20 }}>
            <button onClick={signOut}>Sign out</button>
          </div>
        </section>
      )}
    </main>
  );
}


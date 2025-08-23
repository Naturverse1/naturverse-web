import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Profile = {
  id: string;
  display_name: string | null;
  email: string | null;
  photo_url: string | null;
  updated_at: string | null;
};

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const email = sessionData.session?.user?.email ?? null;
      if (!mounted) return;
      setUserEmail(email);

      if (email) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", email)
          .maybeSingle();
        if (!mounted) return;
        setProfile(data ?? null);
      }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <main><h1>Profile</h1><p>Loading…</p></main>;
  if (!userEmail) return <main><h1>Profile</h1><p>Please sign in to view your profile.</p></main>;

  return (
    <main>
      <h1>Profile</h1>
      <div className="card">
        <p><strong>Email:</strong> {userEmail}</p>
        <p><strong>Name:</strong> {profile?.display_name ?? "—"}</p>
        {profile?.photo_url && <img src={profile.photo_url} alt="Avatar" width={96} height={96} />}
        <p style={{ opacity: .7, fontSize: 12 }}>Last updated: {profile?.updated_at ?? "—"}</p>
      </div>
    </main>
  );
}


import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import LazyImg from "../components/LazyImg";

type Profile = {
  id: string;
  display_name: string | null;
  email: string | null;
  photo_url: string | null;
  updated_at: string | null;
};

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!mounted) return;

      if (!session) {
        setLoading(false);
        return;
      }

      const uid = session.user.id;
      setUserId(uid);
      setEmail(session.user.email ?? null);

      // ensure a row exists
      await supabase
        .from("profiles")
        .upsert({ id: uid, email: session.user.email ?? null }, { onConflict: "id" });

      // fetch current profile
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();

      if (!mounted) return;

      if (data) {
        setProfile(data as Profile);
        setDisplayName(data.display_name ?? "");
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    try {
      setSaving(true);

      // 1) upload file if chosen
      let photo_url = profile?.photo_url ?? null;
      const file = fileRef.current?.files?.[0] ?? null;

      if (file) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${userId}.${ext}`; // overwrite per user
        const { error: upErr } = await supabase.storage
          .from("avatars")
          .upload(path, file, { upsert: true, cacheControl: "3600" });
        if (upErr) throw upErr;

        const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
        photo_url = pub.publicUrl;
      }

      // 2) save name + photo url
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName || null, photo_url })
        .eq("id", userId);

      if (error) throw error;

      // 3) refresh local state
      setProfile((p) => (p ? { ...p, display_name: displayName || null, photo_url } : p));
      alert("Profile saved ✅");
    } catch (err: any) {
      console.error(err);
      alert(`Save failed: ${err.message ?? err}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main><h1>Profile</h1><p>Loading…</p></main>;
  if (!email) return (
    <main>
      <h1>Profile</h1>
      <p>Please sign in to view and edit your profile.</p>
    </main>
  );

  return (
    <main className="profile-page">
      <h1>Profile</h1>

      <div className="card" style={{ maxWidth: 520 }}>
        <form onSubmit={onSave}>
          <div className="row">
            <label>Email</label>
            <input type="email" value={email} disabled />
          </div>

          <div className="row">
            <label>Display name</label>
            <input
              type="text"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="row">
            <label>Avatar</label>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input ref={fileRef} type="file" accept="image/*" />
              {profile?.photo_url ? (
                <LazyImg
                  src={profile.photo_url}
                  alt="Avatar preview"
                  width={56}
                  height={56}
                  style={{ borderRadius: 8, objectFit: "cover" }}
                />
              ) : (
                <span style={{ opacity: 0.6, fontSize: 12 }}>No image</span>
              )}
            </div>
          </div>

          <div className="actions">
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
        <p className="meta">Last updated: {profile?.updated_at ?? "—"}</p>
      </div>
    </main>
  );
}


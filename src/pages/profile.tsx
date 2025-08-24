import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // existing client

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
};

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("—");

  useEffect(() => {
    (async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) console.error(error);
      if (!user) return;
      setUserId(user.id);
      setEmail(user.email ?? "");

      const { data, error: profErr } = await supabase
        .from<Profile>("natur.profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profErr && profErr.code !== "PGRST116") {
        console.error(profErr);
      }

      if (data) {
        setDisplayName(data.display_name ?? "");
        setAvatarUrl(data.avatar_url ?? "");
        setLastUpdated(data.updated_at ? new Date(data.updated_at).toLocaleString() : "—");
      } else {
        // bootstrap empty row so updates work
        await supabase.from("natur.profiles").insert({ id: user.id, email: user.email }).single().catch(() => {});
      }
    })();
  }, []);

  async function handleSave() {
    try {
      if (!userId) throw new Error("Not signed in.");
      setSaving(true);

      let newAvatarUrl = avatarUrl;

      if (avatarFile) {
        const path = `${userId}/avatar.png`;
        const { error: upErr } = await supabase
          .storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true, cacheControl: "3600" });
        if (upErr) throw upErr;

        const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
        newAvatarUrl = pub.publicUrl;
      }

      const { data, error: updErr } = await supabase
        .from("natur.profiles")
        .update({ display_name: displayName || null, avatar_url: newAvatarUrl || null })
        .eq("id", userId)
        .select("*")
        .single();

      if (updErr) throw updErr;

      setAvatarUrl(data.avatar_url ?? "");
      setLastUpdated(data.updated_at ? new Date(data.updated_at).toLocaleString() : "—");
      alert("Saved!");
    } catch (e: any) {
      const msg = e?.message ?? JSON.stringify(e);
      console.error(e);
      alert(`Save failed: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="container">
      <h1>Profile</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSave();
        }}
        className="card"
      >
        <label>Email</label>
        <input value={email} disabled aria-readonly="true" />

        <label>Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
        />

        <label>Avatar</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
        />
        {avatarUrl ? (
          <div style={{ marginTop: 8 }}>
            <img src={avatarUrl} alt="Your avatar" width={64} height={64} style={{ borderRadius: 8 }} />
          </div>
        ) : (
          <div style={{ opacity: 0.6, fontSize: 12 }}>No image</div>
        )}

        <button type="submit" disabled={saving} style={{ marginTop: 12 }}>
          {saving ? "Saving…" : "Save profile"}
        </button>

        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
          Last updated: {lastUpdated}
        </div>
      </form>
    </main>
  );
}


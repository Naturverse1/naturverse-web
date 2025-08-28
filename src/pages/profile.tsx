import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import WalletPanel from "../components/profile/WalletPanel";
import XPPanel from "../components/profile/XPPanel";
import { useCloudProfile } from "../hooks/useCloudProfile";
import type { LocalProfile } from "../types/profile";
import { setTitle } from "./_meta";
import Breadcrumbs from "../components/Breadcrumbs";
import { lsGet, lsSet } from "../lib/safe";

const K = {
  profile: "naturverse.profile.v1",
  navatar: "naturverse.navatar.v1",
  natur: "naturverse.natur.balance.v1",
  turian: "naturverse.turian.history.v1",
} as const;

export default function ProfilePage() {
  setTitle("Profile");
  const [p, setP] = useState<LocalProfile>(() =>
    lsGet(K.profile, {
      displayName: "",
      email: "",
      kidSafeChat: false,
      theme: "system",
      newsletter: false,
    })
  );

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("—");

  const { userId, cloud, loading: cloudLoading, saveFromLocal } = useCloudProfile();

  useEffect(() => {
    lsSet(K.profile, p);
  }, [p]);

  useEffect(() => {
    if (cloud) {
      setP((prev) => ({
        ...prev,
        displayName: cloud.display_name ?? "",
        email: cloud.email ?? "",
        kidSafeChat: cloud.kid_safe_chat ?? false,
        theme: (cloud.theme as LocalProfile["theme"]) ?? "system",
        newsletter: cloud.newsletter ?? false,
      }));
      setAvatarUrl(cloud.avatar_url ?? "");
      setLastUpdated(cloud.updated_at ? new Date(cloud.updated_at).toLocaleString() : "—");
    }
  }, [cloud]);

  useEffect(() => {
    if (p.email || !supabase) return;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) setP((prev) => ({ ...prev, email: data.user!.email! }));
    })();
  }, [p.email, supabase]);

  async function handleSave() {
    try {
      if (!userId || !supabase) throw new Error("Not signed in.");
      setSaving(true);

      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        const path = `${userId}/avatar.png`;
        const { error: upErr } = await supabase
          .storage.from("avatars")
          .upload(path, avatarFile, { upsert: true, cacheControl: "3600" });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
        newAvatarUrl = pub.publicUrl;
      }

      const { error } = await saveFromLocal(p, newAvatarUrl);
      if (error) throw error;
      setAvatarUrl(newAvatarUrl);
      setLastUpdated(new Date().toLocaleString());
      alert("Saved!");
    } catch (e: any) {
      const msg = e?.message ?? JSON.stringify(e);
      console.error(e);
      alert(`Save failed: ${msg}`);
    } finally {
      setSaving(false);
    }
  }

  const saveToCloud = async () => {
    await saveFromLocal(p, avatarUrl || null);
    // silent; local UI already shows values
  };

  return (
    <div className="nvrs-section profile">
      <main className="container profile-page">
        <Breadcrumbs />
        <h1>Profile</h1>
        <form
        className="card"
        onSubmit={(e) => {
          e.preventDefault();
          void handleSave();
        }}
      >
        <label>Email</label>
        <input value={p.email} disabled />

        <label>Display name</label>
        <input
          value={p.displayName}
          onChange={(e) => setP({ ...p, displayName: e.target.value })}
          placeholder="Your name"
        />

        <label>Avatar</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
        />
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Your avatar"
            width={64}
            height={64}
            style={{ borderRadius: 8, marginTop: 8 }}
          />
        )}

        <button type="submit" disabled={saving} style={{ marginTop: 12 }}>
          {saving ? "Saving…" : "Save profile"}
        </button>

        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
          Last updated: {lastUpdated}
        </div>

        {/* Local Sign out lives here only */}
        {supabase && (
          <button
            type="button"
            onClick={async () => { if (!supabase) return; await supabase.auth.signOut(); location.href = "/"; }}
            className="secondary"
            style={{ marginTop: 12 }}
          >
            Sign out
          </button>
        )}
      </form>

      <section className="panel">
        <h2>Cloud Sync</h2>
        {!userId ? (
          <p className="muted">Sign in to sync your profile to the cloud.</p>
        ) : (
          <>
            <div className="grid2">
              <div>
                <p className="muted">
                  {cloudLoading ? "Checking cloud…" : cloud ? `Last update ready.` : "No cloud profile yet."}
                </p>
                <button className="btn" type="button" onClick={saveToCloud}>Save to Cloud</button>
              </div>
              <div>
                {cloud && (
                  <div className="muted">
                    <div><strong>Cloud name:</strong> {cloud.display_name || "—"}</div>
                    <div><strong>Theme:</strong> {cloud.theme || "—"}</div>
                    <div><strong>Kid-safe:</strong> {String(!!cloud.kid_safe_chat)}</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </section>

      <section className="panel">
        <h2>Account & App Data</h2>
        <p className="muted">Signed-in data will sync with Supabase as features roll in.</p>
      </section>

        <WalletPanel />
        <XPPanel />
      </main>
    </div>
  );
}

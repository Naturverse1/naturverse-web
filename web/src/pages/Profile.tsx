import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/supabaseClient";
import { uploadAvatar } from "@/lib/avatar";
import { useAuth } from "@/providers/AuthProvider";
import Navbar from "@/components/Navbar";

const Profile: React.FC = () => {
  const { user: sessionUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!sessionUser) { setLoading(false); return; }
    (async () => {
      const { data, error } = await supabase
        .from('users')
        .select('avatar_url, avatar_path, email')
        .eq('id', sessionUser.id)
        .single();
      if (!error && data) {
        setUser(data);
        setAvatarUrl((data.avatar_url as string) ?? null);
        setAvatarPath((data.avatar_path as string) ?? null);
      }
      setLoading(false);
    })();
  }, [sessionUser]);

  const handleSelectAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { alert('Please select an image'); return; }
    if (f.size > 5 * 1024 * 1024) { alert('Image must be ≤ 5MB'); return; }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!file || !sessionUser) return;
    setSaving(true);
    const oldPath = avatarPath ?? null;
    try {
      // Upload new avatar
      const { publicUrl, path } = await uploadAvatar(supabase, sessionUser.id, file);
      // Update DB
      await supabase.from('users').update({ avatar_url: publicUrl, avatar_path: path }).eq('id', sessionUser.id);
      // Remove old avatar if present
      if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath]).catch(() => {});
      }
      setAvatarUrl(publicUrl);
      setAvatarPath(path);
      setPreviewUrl(null);
      setFile(null);
      alert('Avatar updated');
    } catch (err: any) {
      alert(err?.message ?? 'Failed to save avatar');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.assign("/");
  };

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 560, margin: "3rem auto", border: "1px solid #ddd", padding: 24, borderRadius: 8 }}>
        <h2>Welcome{user?.email ? `, ${user.email.split("@")[0]}` : ""}!</h2>
        <p>Email: {user?.email ?? "—"}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
          <img
            src={previewUrl ?? avatarUrl ?? "/avatar-placeholder.png"}
            alt="avatar"
            width={96}
            height={96}
            style={{ borderRadius: 9999, objectFit: "cover", background: "#f3f3f3" }}
          />
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleSelectAvatar}
              style={{ display: 'block', marginBottom: 4 }}
            />
            {file && (
              <div style={{ fontSize: 12, color: '#555' }}>
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            )}
            <button onClick={handleSave} disabled={!file || saving} style={{ marginTop: 4 }}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
    </>
  );
};

export default Profile;



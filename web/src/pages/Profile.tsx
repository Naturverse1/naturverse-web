import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/supabaseClient";
import { ensureUserRow } from "@/providers/ProfileProvider";
import { useProfile } from "@/providers/ProfileProvider";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { avatarUrl, avatarPath, email, loading, setAvatarUrl, setAvatarPath } = useProfile();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleSelectAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) { alert('Please select an image'); return; }
    if (f.size > 5 * 1024 * 1024) { alert('Image must be ≤ 5MB'); return; }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!file) return;
    setSaving(true);
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      const userEmail = user.data.user?.email;
      if (!userId) throw new Error('Not signed in');
      await ensureUserRow({ id: userId, email: userEmail });
      if (avatarPath) {
        await supabase.storage.from('avatars').remove([avatarPath]).catch(() => {});
      }
      const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
      const newPath = `avatars/${userId}/${crypto.randomUUID()}.${ext}`;
      await supabase.storage.from('avatars').upload(newPath, file, { upsert: true, contentType: file.type });
      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(newPath);
      const publicUrl = pub.publicUrl;
      const { data, error } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl, avatar_path: newPath, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select('avatar_url, avatar_path')
        .single();
      if (error) throw error;
      setAvatarUrl((data.avatar_url as string) ?? null);
      setAvatarPath((data.avatar_path as string) ?? null);
      setPreviewUrl(null);
      setFile(null);
      setSaving(false);
      alert('Avatar updated');
      navigate('/');
    } catch (err: any) {
      alert(err?.message ?? 'Failed to save avatar');
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.assign("/");
  };

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 560, margin: "3rem auto", border: "1px solid #ddd", padding: 24, borderRadius: 8 }}>
      <h2>Welcome{email ? `, ${email.split("@")[0]}` : ""}!</h2>
      <p>Email: {email ?? "—"}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
        <img
          src={previewUrl || avatarUrl || "/avatar-placeholder.png"}
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
  );
};

export default Profile;



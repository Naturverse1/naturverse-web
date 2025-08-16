import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { getFileExt, uploadAvatar, removeAvatarIfExists } from "@/lib/avatar";
import { assetUrlOrPlaceholder } from "@/lib/assets";

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/login");
      const { data, error } = await supabase
        .from("users")
        .select("email, avatar_url, avatar_path")
        .eq("id", user.id)
        .single();
      if (!error && data) {
        setUserEmail((data.email as string) || "");
        setAvatarUrl((data.avatar_url as string) ?? null);
        setAvatarPath((data.avatar_path as string) ?? null);
      }
      setLoading(false);
    })();
  }, [navigate]);

  const handleSelectAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { alert("Please select an image"); return; }
    if (f.size > 5 * 1024 * 1024) { alert("Image must be ≤ 5MB"); return; }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!file || uploading) return;
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      if (avatarPath || avatarUrl) await removeAvatarIfExists(supabase, avatarPath || avatarUrl);
      const { publicUrl, path } = await uploadAvatar(supabase, user.id, file);
      await supabase.from("users").update({
        avatar_url: publicUrl,
        avatar_path: path,
        updated_at: new Date().toISOString()
      }).eq("id", user.id);
      setAvatarUrl(publicUrl); // local state so it shows immediately
      setAvatarPath(path);
      setPreviewUrl(null);
      setFile(null);
      alert("Avatar updated");
      setUploading(false);
      navigate("/");
    } catch (err: any) {
      alert(err?.message ?? "Failed to save avatar");
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 560, margin: "3rem auto", border: "1px solid #ddd", padding: 24, borderRadius: 8 }}>
      <h2>Welcome{userEmail ? `, ${userEmail.split("@")[0]}` : ""}!</h2>
      <p>Email: {userEmail || "—"}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
        <img
          src={previewUrl || avatarUrl || assetUrlOrPlaceholder()}
          alt="avatar"
          width={96}
          height={96}
          style={{ borderRadius: 9999, objectFit: "cover", background: "#f3f3f3" }}
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = assetUrlOrPlaceholder(); }}
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
          <button onClick={handleSave} disabled={!file || uploading} style={{ marginTop: 4 }}>
            {uploading ? "Saving…" : "Save"}
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



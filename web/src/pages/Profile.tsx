import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { getMyProfile, getPublicAvatarUrl, uploadNavatar } from "@/lib/avatar";

export default function Profile() {
  const [email, setEmail] = useState<string>("");
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const prof = await getMyProfile();
      setEmail(prof?.email ?? "");
      setAvatarPath(prof?.avatar_path ?? null);
      setAvatarUrl(getPublicAvatarUrl(prof?.avatar_path));
    })();
  }, []);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    // show immediate preview
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
  };

  const onSave = async () => {
    if (!file) return;
    setSaving(true);
    try {
      const newPath = await uploadNavatar(file);
      setAvatarPath(newPath);
      setAvatarUrl(getPublicAvatarUrl(newPath)); // new public URL + cache bust
      setPreviewUrl(null); // we now have a real URL
      alert("Navatar updated");
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Failed to update Navatar");
    } finally {
      setSaving(false);
    }
  };

  const shownSrc = previewUrl || avatarUrl || "/avatar-placeholder.png";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <img
        src={shownSrc}
        alt="navatar"
        className="h-32 w-32 rounded-full object-cover shadow-md border border-white/10"
      />
      <p className="mt-4 font-medium">{email}</p>

      <div className="mt-4 flex items-center gap-3">
        <input type="file" accept="image/*" onChange={onPick} />
        <button
          onClick={onSave}
          disabled={saving || !file}
          className="px-3 py-1.5 rounded bg-sky-600 text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Navatar"}
        </button>
      </div>
    </div>
  );
}

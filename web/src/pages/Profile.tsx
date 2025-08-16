import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/supabaseClient";
import { uploadAvatar, fetchAvatar } from "@/lib/avatar";

export default function Profile() {
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // On mount, get the current user + current avatar
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      setEmail(user.email ?? "");
      try {
        const url = await fetchAvatar(user.id);
        setAvatarUrl(url);
      } catch {
        // ignore – empty avatar is fine
      }
    })();
  }, []);

  function onChooseFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  async function onSave() {
    if (!userId || !inputRef.current?.files?.[0]) return;
    setSaving(true);
    try {
      const file = inputRef.current.files[0];
      const { url } = await uploadAvatar(file, userId);
      // Reflect immediately
      setAvatarUrl(url);
      setPreviewUrl(null);
      alert("Navatar updated");
    } catch (e: any) {
      alert(e.message ?? "Failed to update Navatar");
    } finally {
      setSaving(false);
      // Reset file input so the same image can be reselected if desired
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-black/20 backdrop-blur p-6 text-center shadow-lg border border-white/10">
        <div className="mb-4 flex justify-center">
          {/* Avatar figure – fixed size, always cropped */}
          <img
            src={previewUrl ?? avatarUrl ?? "/avatar-placeholder.png"}
            alt="navatar"
            className="h-28 w-28 rounded-full object-cover ring-2 ring-white/20 shadow"
          />
        </div>

        <div className="text-white/90 font-medium">{email}</div>

        <div className="mt-4 flex items-center gap-2 justify-center">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onChooseFile}
            className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-white/80 file:px-3 file:py-2 file:text-sm file:font-semibold hover:file:bg-white"
          />
          <button
            onClick={onSave}
            disabled={!previewUrl || saving}
            className="rounded-md bg-sky-500/90 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Navatar"}
          </button>
        </div>
      </div>
    </div>
  );
}


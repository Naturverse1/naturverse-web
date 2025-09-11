import { FormEvent, useRef, useState } from "react";
import { uploadAvatar } from "@/lib/navatarApi";

export default function UploadNavatar() {
  const [name, setName] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return alert("Pick a file first.");
    try {
      setBusy(true);
      await uploadAvatar(file, name || undefined);
      alert("Uploaded!");
      location.assign("/navatar");
    } catch (e: any) {
      alert(`Upload failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="text-sm text-blue-600 mb-2"><a href="/">Home</a> / <a href="/navatar">Navatar</a> / Upload</div>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Upload</h1>

      <form onSubmit={onSubmit} className="max-w-xl rounded-2xl bg-white shadow p-4 space-y-4">
        <input placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)}
          className="w-full border rounded px-3 py-2"/>
        <input type="file" ref={fileRef} accept="image/*" className="w-full" />
        <button disabled={busy} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {busy ? "Uploading…" : "Save"}
        </button>
      </form>
    </div>
  );
}

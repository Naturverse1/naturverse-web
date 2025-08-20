import React, { useState } from "react";
import UploadButton from "../../components/UploadButton";
import { supabase } from "../../supabaseClient";

export default function Observations() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");

  async function upload() {
    if (!file) return;
    setMsg("Uploading…");
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id || "anon";
      const path = `observations/${userId}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("observations").upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;
      setMsg("Uploaded! Thank you, explorer.");
    } catch (e: any) {
      setMsg("Upload failed");
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Observations</h1>
      <p>Snap plants, animals, insects, or cool weather patterns and upload.</p>
      <div className="flex items-center gap-3">
        <UploadButton accept="image/*" onSelect={setFile}/>
        <button onClick={upload} className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-50" disabled={!file}>Upload</button>
      </div>
      {msg && <div className="text-sm">{msg}</div>}
    </div>
  );
}

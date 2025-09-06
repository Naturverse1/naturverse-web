import { useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { setActive } from "../../lib/navatar/storage";
import { uploadAvatarImage, saveAvatarRow } from "../../lib/navatar/useSupabase";
import { useNavigate } from "react-router-dom";

export default function NavatarUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const nav = useNavigate();

  async function onSave() {
    if (!file) return;
    const userId = "anon"; // replace with real auth id when available
    const publicUrl = await uploadAvatarImage(userId, file);
    setActive({
      id: crypto.randomUUID(),
      name,
      imageUrl: publicUrl,
      createdAt: Date.now(),
    });
    await saveAvatarRow({ user_id: userId, name, image_url: publicUrl, meta: {} });
    nav("/navatar");
  }

  return (
    <div className="container">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/navatar", label: "Navatar" },
          { label: "Upload" },
        ]}
      />
      <h1 className="center">Upload a Navatar</h1>
      <NavatarTabs />

      <div className="form">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <input
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={onSave} disabled={!file}>
          Save
        </button>
      </div>

      <style>{`
        .center{text-align:center}
        .form{max-width:520px;margin:16px auto;display:grid;gap:10px}
        input{border:1px solid #c9d6ff;border-radius:10px;padding:10px}
        button{background:#1f4bff;color:#fff;border:none;border-radius:10px;padding:12px;font-weight:700}
      `}</style>
    </div>
  );
}

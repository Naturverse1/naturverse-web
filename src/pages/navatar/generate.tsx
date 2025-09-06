import { useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarTabs from "../../components/NavatarTabs";
import { setActive } from "../../lib/navatar/storage";
import { uploadAvatarImage, saveAvatarRow } from "../../lib/navatar/useSupabase";
import { useNavigate } from "react-router-dom";

export default function NavatarGenerate() {
  const [file, setFile] = useState<File | null>(null);
  const [desc, setDesc] = useState("");
  const nav = useNavigate();

  async function onSave() {
    if (!file) return; // for now, require a file
    const userId = "anon";
    const publicUrl = await uploadAvatarImage(userId, file);
    setActive({
      id: crypto.randomUUID(),
      name: desc || "Generated",
      imageUrl: publicUrl,
      createdAt: Date.now(),
    });
    await saveAvatarRow({ user_id: userId, name: desc, image_url: publicUrl, meta: { from: "generate" } });
    nav("/navatar");
  }

  return (
    <div className="container">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/navatar", label: "Navatar" },
          { label: "Generate" },
        ]}
      />
      <h1 className="center">Generate a Navatar</h1>
      <NavatarTabs />

      <div className="form">
        <textarea
          placeholder="Describe your Navatar"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button onClick={onSave} disabled={!file}>
          Save
        </button>
      </div>

      <style>{`
        .center{text-align:center}
        .form{max-width:520px;margin:16px auto;display:grid;gap:10px}
        textarea{border:1px solid #c9d6ff;border-radius:10px;padding:10px}
        input{border:1px solid #c9d6ff;border-radius:10px;padding:10px}
        button{background:#1f4bff;color:#fff;border:none;border-radius:10px;padding:12px;font-weight:700}
      `}</style>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarCard from "../../components/NavatarCard";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import { uploadNavatar } from "../../lib/navatar";
import { setActiveNavatarId } from "../../lib/localNavatar";
import "../../styles/navatar.css";

export default function UploadNavatarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const nav = useNavigate();

  useEffect(() => {
    if (!file) {
      setPreviewUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    try {
      const row = await uploadNavatar(file, name || undefined);
      setActiveNavatarId(row.id);
      alert("Uploaded ✓");
      nav("/navatar");
    } catch {
      alert("Upload failed");
    }
  }

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Upload" }]} />
      <h1 className="center">Upload a Navatar</h1>
      <BackToMyNavatar />
      <form
        onSubmit={onSave}
        style={{ display: "grid", justifyItems: "center", gap: 12, maxWidth: 480, margin: "16px auto" }}
      >
        <NavatarCard src={previewUrl} title={name || "My Navatar"} />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <input
          style={{ display: "block", width: "100%" }}
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="pill pill--active" type="submit">
          Save
        </button>
      </form>
    </main>
  );
}


import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { NavTabs } from "../../components/navatar/Tabs";
import NavatarFrame from "../../components/navatar/NavatarFrame";
import { setMyNavatar } from "../../lib/navatar";
import "../../styles/navatar.css";

export default function UploadNavatarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);
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

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Upload" }]} />
      <h1 className="center">Upload a Navatar</h1>
      <NavTabs active="upload" />
      <div style={{ display: "grid", justifyItems: "center", gap: 12, maxWidth: 480, margin: "16px auto" }}>
        <NavatarFrame src={previewUrl} title="My Navatar" onClick={() => fileRef.current?.click()} />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setFile(f);
          }}
        />
        <input
          style={{ display: "block", width: "100%" }}
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="pill pill--active"
          onClick={async () => {
            if (!file) return;
            await setMyNavatar(file, name);
            alert("Uploaded \u2713");
            nav("/navatar");
          }}
        >
          Save
        </button>
      </div>
    </main>
  );
}

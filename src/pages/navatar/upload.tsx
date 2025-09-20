import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarCard from "../../components/NavatarCard";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { uploadNavatar } from "../../lib/navatar";
import { setActiveNavatarId } from "../../lib/localNavatar";
import { useToast } from "../../components/Toast";
import "../../styles/navatar.css";

export default function UploadNavatarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!file) {
      setPreviewUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || saving) return;
    setSaving(true);
    try {
      const row = await uploadNavatar(file, name || undefined);
      setActiveNavatarId(row.id);
      toast({ text: "Uploaded ✓", kind: "ok" });
      nav("/navatar");
    } catch (error) {
      console.error(error);
      toast({ text: "Upload failed", kind: "err" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-pad mx-auto max-w-4xl p-4">
      <div className="bcRow">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Upload" }]} />
      </div>
      <h1 className="pageTitle mt-6 mb-12">Upload a Navatar</h1>
      <BackToMyNavatar />
      <NavatarTabs context="subpage" />
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
        <button className="pill pill--active" type="submit" disabled={!file || saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </main>
  );
}


import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import NavatarCard from "../../components/NavatarCard";
import BackToMyNavatar from "../../components/BackToMyNavatar";
import NavatarTabs from "../../components/NavatarTabs";
import { uploadNavatar } from "../../lib/navatar";
import { setActiveNavatarId } from "../../lib/localNavatar";
import { useToast } from "../../components/Toast";
import "../../styles/navatar.css";

type SubmitEvent = FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>;

export default function UploadNavatarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
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

  const attemptUpload = async () => {
    if (saving) return;
    if (!file) {
      toast({ text: "Choose an image before saving.", kind: "warn" });
      return;
    }

    setSaving(true);
    try {
      const row = await uploadNavatar(file, name || undefined);
      setActiveNavatarId(row.id);
      toast({ text: "Uploaded ✓", kind: "ok" });
      nav("/navatar");
    } catch {
      toast({ text: "Upload failed", kind: "err" });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    void attemptUpload();
  };

  return (
    <main className="page-pad mx-auto max-w-4xl p-4">
      <div className="bcRow">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/navatar", label: "Navatar" }, { label: "Upload" }]} />
      </div>
      <h1 className="pageTitle mt-6 mb-12">Upload a Navatar</h1>
      <BackToMyNavatar />
      <NavatarTabs context="subpage" />
      <form
        onSubmit={handleSubmit}
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
        <button
          className="pill pill--active"
          type="submit"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </main>
  );
}


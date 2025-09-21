import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadNavatar } from "../../lib/navatar/uploadNavatar";
import { useToast } from "../../components/Toast";
import "../../styles/navatar.css";

export default function UploadNavatarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!file) return setPreviewUrl(undefined);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!file) {
      toast({ text: "Choose an image first.", kind: "warn" });
      return;
    }
    try {
      setSaving(true);
      const row = await uploadNavatar(file, name || undefined);
      toast({ text: "Uploaded ✓", kind: "ok" });
      // go back to Navatar hub
      nav("/navatar");
    } catch (err: any) {
      console.error(err);
      toast({ text: err?.message || "Upload failed", kind: "err" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-pad mx-auto max-w-4xl p-4">
      <h1 className="pageTitle mt-6 mb-12">Upload a Navatar</h1>

      <form onSubmit={onSave} style={{ display: "grid", gap: 12, maxWidth: 480 }}>
        {previewUrl ? (
          // simple preview
          <img
            src={previewUrl}
            alt="preview"
            style={{ width: "100%", maxWidth: 360, borderRadius: 12 }}
          />
        ) : (
          <div style={{ width: 360, height: 360, background: "#eee", borderRadius: 12 }} />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <input
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", width: "100%" }}
        />

        <button
          type="submit"
          className="pill pill--active"
          aria-disabled={saving || !file}
          disabled={saving || !file}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </main>
  );
}

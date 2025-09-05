import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/db";
import { saveNavatar } from "@/lib/navatar";
import Breadcrumbs from "@/components/Breadcrumbs";
import "../../styles/navatar.css";

const types = ["Animal", "Fruit", "Insect", "Spirit"] as const;

export default function NavatarCreate() {
  const [baseType, setBaseType] = useState<typeof types[number]>("Animal");
  const [name, setName] = useState("");
  const [backstory, setBackstory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const {
      data: { user },
      error: uErr,
    } = await supabase.auth.getUser();
    if (uErr || !user) {
      alert("Please sign in to save your Navatar");
      setSaving(false);
      return;
    }

    try {
      await saveNavatar({
        supabase,
        userId: user.id,
        name: name || null,
        baseType,
        backstory: backstory || null,
        file,
      });
      alert("Navatar saved!");
      navigate("/navatar");
    } catch (err) {
      console.error(err);
      alert("Could not save Navatar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4 navatar-page">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/navatar", label: "Navatar" },
          { label: "Create" },
        ]}
      />
      <h2 className="text-2xl font-bold">Navatar Creator</h2>
      <form className="space-y-4 navatar-form navatar-layout" onSubmit={onSave}>
        <div>
          <label className="block mb-1 font-semibold">Base type</label>
          <select
            value={baseType}
            onChange={(e) => setBaseType(e.target.value as typeof types[number])}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Backstory</label>
          <textarea
            value={backstory}
            onChange={(e) => setBackstory(e.target.value)}
            rows={3}
            placeholder="Backstory (optional)"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Image</label>
          <input type="file" accept="image/*" onChange={onFile} />
        </div>

        <div className="navatar-preview">
          {preview ? (
            <img src={preview} alt="Navatar preview" />
          ) : (
            <div className="empty-preview">No photo</div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded border px-3 py-1"
        >
          {saving ? "Saving..." : "Save Navatar"}
        </button>
      </form>
    </section>
  );
}

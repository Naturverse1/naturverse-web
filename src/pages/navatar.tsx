import { useState } from "react";
import canon from "../data/navatar-canon.json";
import { supabase, saveCanonAvatar } from "../lib/supabase";

export default function NavatarPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      alert("Please sign in first");
      setSaving(false);
      return;
    }
    try {
      await saveCanonAvatar(user.id, selected);
      alert("Saved canon avatar!");
    } catch (err) {
      console.error(err);
      alert("Error saving avatar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pick Your Canon Avatar</h1>
      <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto border p-4 rounded">
        {canon.map((c) => (
          <div
            key={c.file}
            className={`cursor-pointer border-4 rounded ${
              selected === c.file ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => setSelected(c.file)}
          >
            <img src={c.file} alt={c.name} className="w-full h-auto" />
            <p className="text-center mt-2 text-sm">{c.name}</p>
          </div>
        ))}
      </div>
      <button
        disabled={!selected || saving}
        onClick={handleSave}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

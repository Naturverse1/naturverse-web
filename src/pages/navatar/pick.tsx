import { useEffect, useState } from "react";
import { listPublicAvatars, pickAvatar, AvatarRow } from "@/lib/navatarApi";

export default function PickNavatar() {
  const [items, setItems] = useState<AvatarRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    listPublicAvatars().then(setItems).catch(e => alert(`Load failed: ${e.message}`));
  }, []);

  async function onPick(a: AvatarRow) {
    try {
      setBusy(a.id);
      await pickAvatar(a);
      alert("Picked!"); // optional toast
      location.assign("/navatar"); // return to My Navatar
    } catch (e: any) {
      alert(`Pick failed: ${e.message}`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="container mx-auto px-4 pb-24">
      <div className="text-sm text-blue-600 mb-2"><a href="/">Home</a> / <a href="/navatar">Navatar</a></div>
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Pick Navatar</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((a) => (
          <button
            key={a.id}
            onClick={() => onPick(a)}
            disabled={!!busy}
            className="rounded-xl bg-white shadow hover:shadow-lg transition p-3 text-left"
          >
            <img
              src={a.thumbnail_url || a.image_url || ""}
              alt={a.name || "Navatar"}
              className="w-full h-[300px] object-cover rounded-lg bg-gray-50"
              loading="lazy"
            />
            <div className="text-center mt-2 font-semibold">{a.name || "Unnamed"}</div>
            {busy === a.id && <div className="text-center text-sm text-gray-500">Saving…</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

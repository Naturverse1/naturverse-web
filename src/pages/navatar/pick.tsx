import React, { useEffect, useState } from "react";
import { getCatalogAvatars, setActiveFromId } from "../../lib/navatar";
import NavatarCard from "../../components/NavatarCard";
import "../../styles/navatar.css";

type Row = {
  id: string;
  name: string | null;
  image_url: string | null;
};

export default function NavatarPickPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getCatalogAvatars(60);
      setRows(data as Row[]);
    })();
  }, []);

  const doPick = async (id: string) => {
    setBusy(true);
    try {
      await setActiveFromId(id);
      alert("Picked!");
    } catch (e: any) {
      alert(e?.message || "Pick failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container page-pad">
      <h1 className="center page-title">Pick Navatar</h1>

      <div className="nv-grid">
        {rows.map((r) => (
          <button
            key={r.id}
            className="nv-pick"
            onClick={() => doPick(r.id)}
            disabled={busy}
            aria-label={`Pick ${r.name ?? "Navatar"}`}
          >
            <NavatarCard src={r.image_url || undefined} title={r.name || "Unnamed"} />
          </button>
        ))}
      </div>
    </main>
  );
}


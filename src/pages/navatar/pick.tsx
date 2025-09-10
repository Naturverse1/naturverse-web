import React, { useEffect, useState } from "react";
import NavatarTabs from "../../components/NavatarTabs";
import { supabase } from "../../lib/supabase-client";
import { setActiveNavatarId } from "../../lib/navatar";
import { useNavigate } from "react-router-dom";
import "../../styles/navatar.css";

type AvatarRow = {
  id: string;
  name: string | null;
  image_url: string | null;
  created_at: string;
};

export default function PickNavatarPage() {
  const nav = useNavigate();
  const [rows, setRows] = useState<AvatarRow[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data, error } = await supabase
        .from("avatars")
        .select("id,name,image_url,created_at")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false });
      if (!alive) return;
      if (!error && data) setRows(data as AvatarRow[]);
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function onPick(id: string) {
    setBusy(true);
    setActiveNavatarId(id);
    // small tick so storage is flushed before navigate
    setTimeout(() => {
      nav("/navatar");
    }, 10);
  }

  return (
    <main className="container page-pad">
      <h1 className="center page-title">Pick</h1>
      <NavatarTabs />

      {!rows.length ? (
        <p className="center" style={{ opacity: 0.8 }}>
          You don’t have any Navatars yet. Try Upload or Generate.
        </p>
      ) : (
        <div className="nv-grid">
          {rows.map((a) => (
            <button
              key={a.id}
              className="nav-card nav-card--button"
              onClick={() => onPick(a.id)}
              disabled={busy}
              title="Set as active"
            >
              <div className="nav-card__img">
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src={a.image_url || ""} alt={a.name || "Navatar"} />
              </div>
              <figcaption className="nav-card__cap">
                <strong>{a.name || "Navatar"}</strong>
              </figcaption>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}


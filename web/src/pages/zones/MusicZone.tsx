import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient"; // adjust if your path differs

type Playlist = { id: number; title: string; description?: string | null };

export default function MusicZone() {
  const [lists, setLists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("playlists")
        .select("id,title,description")
        .order("id", { ascending: true });
      if (error) setError(error.message);
      else setLists(data ?? []);
    })();
  }, []);

  return (
    <section style={{ padding: 16 }}>
      <h2>🎵 Music Zone</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {lists.length === 0 ? (
        <p>Add rows to <code>playlists</code> in Supabase to see them here.</p>
      ) : (
        <ul>
          {lists.map(p => (
            <li key={p.id}>
              <strong>{p.title}</strong>
              {p.description ? <> — {p.description}</> : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

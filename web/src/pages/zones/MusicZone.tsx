import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Playlist = { id:number; name:string; description:string | null; cover_url?:string | null; stream_url?:string | null };

export default function MusicZone() {
  const [items, setItems] = useState<Playlist[]>([]);
  useEffect(() => {
    supabase.from("playlists").select("*").order("id", { ascending: true }).then(({ data }) => setItems(data ?? []));
  }, []);

  return (
    <section>
      <h2>🎵 Music Zone</h2>
      {items.length === 0 ? <p>Add rows to <code>playlists</code> in Supabase to see them here.</p> : (
        <ul>
          {items.map(p => (
            <li key={p.id}>
              <strong>{p.name}</strong> — {p.description}
              {p.stream_url && (
                <div style={{ marginTop: 6 }}>
                  <audio controls src={p.stream_url} style={{ width: 320 }} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

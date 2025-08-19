import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Playlist = { id: string; title: string; description?: string; cover_url?: string; spotify_url?: string };

export default function MusicZone() {
  const [rows, setRows] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("playlists")
        .select("id,title,description,cover_url,spotify_url")
        .order("created_at", { ascending: false });
      if (!error && data) setRows(data as any);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p>🎵 Music Zone • Loading…</p>;
  if (!rows.length) return <p>🎵 Music Zone<br/>Add rows to <code>playlists</code> in Supabase to see them here.</p>;

  return (
    <section>
      <h2>🎵 Music Zone</h2>
      <ul>
        {rows.map(p => (
          <li key={p.id} style={{margin:"1rem 0"}}>
            <strong>{p.title}</strong>
            {p.description && <p>{p.description}</p>}
            {p.spotify_url && <a href={p.spotify_url} target="_blank">Open playlist</a>}
          </li>
        ))}
      </ul>
    </section>
  );
}

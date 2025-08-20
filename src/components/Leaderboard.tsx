import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type Score = { id?: string; name: string; game: string; points: number; created_at?: string };

export default function Leaderboard({ game }: { game: string }) {
  const [rows, setRows] = useState<Score[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from("leaderboard").select("*").eq("game", game).order("points", { ascending: false }).limit(20);
        if (error) throw error;
        setRows(data || []);
      } catch {
        const local = JSON.parse(localStorage.getItem("leaderboard_"+game) || "[]");
        setRows(local);
      }
    })();
  }, [game]);
  return (
    <div>
      <h3 className="font-semibold mb-2">Leaderboard</h3>
      <ol className="space-y-1">
        {rows.map((r,i)=>(
          <li key={r.id || i} className="flex justify-between border rounded px-3 py-1">
            <span>{i+1}. {r.name}</span>
            <span>{r.points}</span>
          </li>
        ))}
        {!rows.length && <li className="text-sm text-neutral-500">No scores yet.</li>}
      </ol>
    </div>
  );
}

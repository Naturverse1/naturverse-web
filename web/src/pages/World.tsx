import React from "react";
import { useParams, Link } from "react-router-dom";

export default function World() {
  const { slug } = useParams();
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-white">
      <Link to="/worlds" className="text-sky-300 underline">← Back to Worlds</Link>
      <h1 className="text-3xl font-bold mt-4 capitalize">{(slug ?? "").replace(/-/g, " ")}</h1>
      <p className="mt-2 text-white/80">
        This is a placeholder page for <strong>{slug}</strong>. We’ll add real scenes, maps and activities here.
      </p>
    </main>
  );
}

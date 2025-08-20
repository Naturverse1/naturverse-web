import React from "react";
import { useParams } from "react-router-dom";
import { WORLDS } from "../../lib/content";

export default function WorldDetail() {
  const { id } = useParams();
  const w = WORLDS[(id || "thailandia") as keyof typeof WORLDS];
  if (!w) return <div className="p-4">World not found.</div>;
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        {w.mapImage && <img src={w.mapImage} alt="map" className="w-32 h-32 object-cover rounded" />}
        <div>
          <h1 className="text-3xl font-bold">{w.title}</h1>
          <div className="text-neutral-600">{w.fruitAnimal} · Hero: {w.hero}</div>
        </div>
      </div>
      <p>{w.blurb}</p>
    </div>
  );
}

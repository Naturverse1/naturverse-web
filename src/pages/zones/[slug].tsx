import React from "react";
import { useParams } from "react-router-dom";
import { ZONES } from "../../data/zones";

export default function ZoneDetail() {
  const { slug } = useParams();
  const zone = ZONES.find(z => z.slug === slug);

  if (!zone) return <main><p>Zone not found.</p></main>;

  return (
    <main style={{ maxWidth: 800, margin: "24px auto", padding: "0 20px" }}>
      <h1>{zone.emoji} {zone.name}</h1>
      <p style={{ opacity: .8 }}>{zone.region}</p>
      <p>{zone.summary}</p>

      <p style={{ marginTop: 20 }}>
        <a className="btn" href="/zones">← Back to Zones</a>
      </p>
    </main>
  );
}

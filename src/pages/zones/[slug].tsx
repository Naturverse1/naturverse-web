import React from "react";
import { useParams } from "react-router-dom";
import { ZONES } from "../../data/zones";
import { getUnlockedZones } from "../../lib/progress";
import "./zones-unlock.css";

export default function ZoneDetail() {
  const { slug } = useParams();
  const zone = ZONES.find(z => z.slug === slug);
  const userId = "demo-user-123";

  const [isUnlocked, setIsUnlocked] = React.useState<boolean>(true);

  React.useEffect(() => {
    (async () => {
      const set = await getUnlockedZones(userId);
      setIsUnlocked(slug ? set.has(slug) : false);
    })();
  }, [slug, userId]);

  if (!zone) return <main><p>Zone not found.</p></main>;

  if (!isUnlocked) {
    return (
      <main style={{ maxWidth: 800, margin: "24px auto", padding: "0 20px" }}>
        <h1>{zone.emoji} {zone.name}</h1>
        <p style={{ opacity: .8 }}>{zone.region}</p>
        <div className="zone-gate">
          <p>This zone is locked. Earn its stamp to unlock.</p>
          <p><a className="btn" href="/progress">Go to Progress</a></p>
        </div>
      </main>
    );
  }

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

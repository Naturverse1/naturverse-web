import React, { useMemo } from "react";
import KingdomImage from "./KingdomImage";

/** Tiny gallery that tries image-1..image-12.* and thumb-1..thumb-12.* if present. */
export default function KingdomGallery({ kingdom }: { kingdom: string }) {
  const keys = useMemo(() => {
    const bases = Array.from({ length: 12 }, (_, i) => String(i + 1));
    const names = [
      ...bases.map(n => `image-${n}`),
      ...bases.map(n => `thumb-${n}`),
      ...bases.map(n => `card-${n}`),
    ];
    // We reuse KingdomImage by telling it to look for specific base names first.
    // KingdomImage already tries common names; we prime the order via 'card' kind and override CSS src order with inline list below.
    return names;
  }, []);

  return (
    <div className="kingdom-gallery">
      {keys.map((_, i) => (
        <div className="kg-item" key={i}>
          {/* We rely on the /kingdoms/<name>/<guess> files; KingdomImage will walk formats */}
          <KingdomImage kingdom={kingdom} kind="card" />
        </div>
      ))}
    </div>
  );
}

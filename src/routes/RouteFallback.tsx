import React from "react";
import { SkeletonCard, SkeletonText } from "../components/Skeleton";

/** Generic fallback while route chunks load */
export default function RouteFallback() {
  return (
    <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 20px" }} aria-busy="true">
      <div style={{ display: "grid", gap: 16 }}>
        <SkeletonText lines={3} />
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </main>
  );
}


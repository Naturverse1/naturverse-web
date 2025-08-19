import React, { Suspense, lazy } from "react";

// Glob all page modules once. Keys look like "../pages/Arcade.tsx", "../pages/Marketplace/index.tsx"
const pages = import.meta.glob("../pages/**/*.tsx");

// Given a relative file path under /src/pages, safely lazy-load it if present.
// Example file values you can pass:
//  - "Home.tsx"
//  - "Worlds.tsx"
//  - "Zones.tsx"
//  - "Arcade.tsx"
//  - "Marketplace/index.tsx"
//  - "Music.tsx"
//  - "Wellness.tsx"
//  - "CreatorsLab.tsx"
//  - "Teachers.tsx"
//  - "Partners.tsx"
//  - "TurianTips.tsx"
//  - "Profile.tsx"
export default function PageLoader({ file }: { file: string }) {
  // Normalize to "../pages/..."
  const key = `../pages/${file}`;
  const mod = (pages as Record<string, () => Promise<{ default: React.ComponentType<any> }>>)[key];

  if (!mod) {
    return (
      <div>
        <h1>Coming soon</h1>
        <p>This page ({file}) isn't available yet.</p>
      </div>
    );
  }

  const LazyComp = lazy(mod);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComp />
    </Suspense>
  );
}

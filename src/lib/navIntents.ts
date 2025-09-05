// src/lib/navIntents.ts
// Lightweight, token-based matcher (no paid APIs). Handles typos a bit.

const ROUTES: Record<string, string> = {
  // core hubs
  "home": "/",
  "naturverse": "/",
  "the naturverse": "/",
  "market": "/marketplace",
  "marketplace": "/marketplace",
  "shop": "/marketplace",
  "store": "/marketplace",

  // marketplace sub-tabs
  "wishlist": "/marketplace/wishlist",
  "specials": "/marketplace/specials",
  "nft": "/marketplace/nft",
  "mint": "/marketplace/mint",

  // learning hub
  "naturversity": "/naturversity",
  "languages": "/naturversity/languages",
  "courses": "/naturversity/courses",
  "stories": "/naturversity/stories",

  // worlds + zones
  "worlds": "/worlds",
  "zones": "/zones",

  // navatar
  "navatar": "/navatar",
  "create": "/navatar/create",
  "pick": "/navatar/pick",
  "upload": "/navatar/upload",
};

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function score(query: string, key: string) {
  // simple overlap score + prefix bonus
  const q = norm(query).split(" ");
  const k = norm(key);
  let hits = 0;
  for (const token of q) if (token && k.includes(token)) hits++;
  const overlap = hits / Math.max(1, q.length);
  const prefix = k.startsWith(norm(query)) ? 0.15 : 0;
  return overlap + prefix; // 0..1.15
}

export function findRoute(input: string): string | null {
  const q = norm(input);
  if (!q) return null;

  // direct match first
  if (ROUTES[q]) return ROUTES[q];

  // token match
  let best: { path: string; s: number } | null = null;
  for (const [k, path] of Object.entries(ROUTES)) {
    const s = score(q, k);
    if (!best || s > best.s) best = { path, s };
  }
  // require a decent match
  return best && best.s >= 0.5 ? best.path : null;
}


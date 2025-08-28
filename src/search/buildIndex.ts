import { WORLDS } from "../data/worlds";
import { ZONES } from "../data/zones";
import { PRODUCTS } from "../data/products";
import { listAllQuests } from "../utils/quests-store";
import { SEED_QUESTS } from "../data/quests";
import type { SearchDoc } from "./index";

export function buildSearchIndex(): SearchDoc[] {
  const quests = listAllQuests(SEED_QUESTS);

  const worlds = WORLDS.map(w => ({
    id: w.id,
    type: "world" as const,
    title: w.name,
    slug: w.slug,
    summary: w.summary,
    tags: w.tags || [],
    url: `/worlds/${w.slug}`
  }));

  const zones = ZONES.map(z => ({
    id: z.slug,
    type: "zone" as const,
    title: z.name,
    slug: z.slug,
    summary: z.summary,
    tags: [z.region],
    url: `/zones/${z.slug}`
  }));

  const products = PRODUCTS.map(p => ({
    id: p.id,
    type: "product" as const,
    title: p.name,
    slug: p.slug,
    summary: p.summary,
    tags: p.tags || [p.category],
    url: `/marketplace/${p.slug}`
  }));

  const questDocs = quests.map(q => ({
    id: q.id,
    type: "quest" as const,
    title: q.title,
    slug: q.slug,
    summary: q.summary,
    tags: q.kingdom ? [q.kingdom] : [],
    url: `/quests/${q.slug}`
  }));

  return [...worlds, ...zones, ...products, ...questDocs];
}


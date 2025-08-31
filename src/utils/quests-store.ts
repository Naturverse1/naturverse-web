import { Quest } from "../data/quests";

const KEY = "nv_quests";
const DONE_KEY = (slug: string) => `nv_quest_done_${slug}`;

export function loadQuests(): Quest[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Quest[]) : [];
  } catch { return []; }
}

export function saveQuests(quests: Quest[]) {
  try { localStorage.setItem(KEY, JSON.stringify(quests)); } catch {}
}

export function upsertQuest(q: Quest) {
  const list = loadQuests();
  const i = list.findIndex(x => x.id === q.id);
  if (i >= 0) list[i] = q; else list.unshift(q);
  saveQuests(list);
}

export function getQuestBySlug(slug: string): Quest | undefined {
  return loadQuests().find(q => q.slug === slug);
}

export function listAllQuests(seed: Quest[]): Quest[] {
  const local = loadQuests();
  // De-dupe by id; prefer local (edited) over seed
  const byId = new Map<string, Quest>(seed.map(q => [q.id, q]));
  local.forEach(q => byId.set(q.id, q));
  return Array.from(byId.values()).sort((a,b)=> (b.updatedAt>a.updatedAt?1:-1));
}

/** Per-quest step completion state (by step id) */
export function getQuestDone(slug: string): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(DONE_KEY(slug)) || "{}"); } catch { return {}; }
}
export function setQuestDone(slug: string, done: Record<string, boolean>) {
  try { localStorage.setItem(DONE_KEY(slug), JSON.stringify(done)); } catch {}
}

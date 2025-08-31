// src/lib/progress.ts
// Persists progress locally; syncs to Supabase when authed.

import { queuePush, queueFlush } from './leaderboard';

export type QuestProgress = { bestScore: number; completed: boolean; updatedAt: string };

const key = (slug: string) => `nv:progress:${slug}`;
const nowISO = () => new Date().toISOString();

// Lazy import to avoid crashing on preview/permalink w/o env
let supabase: any | null = null;
async function getSupabase() {
  if (supabase) return supabase;
  try {
    // Adjust path to your client singleton
    const mod = await import('../lib/supabase-client');
    supabase = (mod as any).supabase || (mod as any).default || null;
  } catch {
    supabase = null;
  }
  return supabase;
}

export function getQuestProgress(slug: string): QuestProgress {
  const raw = localStorage.getItem(key(slug));
  if (!raw) return { bestScore: 0, completed: false, updatedAt: nowISO() };
  try {
    return JSON.parse(raw) as QuestProgress;
  } catch {
    return { bestScore: 0, completed: false, updatedAt: nowISO() };
  }
}

export function setLocal(slug: string, p: QuestProgress) {
  localStorage.setItem(key(slug), JSON.stringify(p));
}

export async function saveQuestProgress(params: {
  slug: string;
  score: number;
  completed?: boolean;
}) {
  const { slug, score, completed = false } = params;
  const current = getQuestProgress(slug);
  const bestScore = Math.max(current.bestScore || 0, score);
  const merged: QuestProgress = {
    bestScore,
    completed: current.completed || completed,
    updatedAt: nowISO(),
  };
  setLocal(slug, merged);

  // Try cloud sync if signed in
  try {
    const client = await getSupabase();
    if (!client) return;

    const { data: userRes } = await client.auth.getUser();
    const user = userRes?.user;
    if (!user) return;

    await client.from('quest_progress').upsert(
      {
        user_id: user.id,
        quest_slug: slug,
        best_score: merged.bestScore,
        completed: merged.completed,
        updated_at: merged.updatedAt,
      },
      { onConflict: 'user_id,quest_slug' },
    );
  } catch {
    /* swallow — offline or no table yet */
  }
}

export async function getQuestCloudProgress(slug: string) {
  try {
    const client = await getSupabase();
    if (!client) return null;
    const { data: userRes } = await client.auth.getUser();
    if (!userRes?.user) return null;

    const { data } = await client
      .from('quest_progress')
      .select('best_score, completed, updated_at')
      .eq('quest_slug', slug)
      .single();

    if (!data) return null;

    const merged: QuestProgress = {
      bestScore: data.best_score ?? 0,
      completed: !!data.completed,
      updatedAt: data.updated_at ?? nowISO(),
    };
    setLocal(slug, merged);
    return merged;
  } catch {
    return null;
  }
}

export async function postScore(questId: string, score: number) {
  try {
    const client = await getSupabase();
    if (!client) {
      queuePush({ questId, score });
      return;
    }
    const { data: userRes } = await client.auth.getUser();
    const user = userRes?.user;
    if (!user) {
      queuePush({ questId, score });
      return;
    }
    await client
      .from('quest_scores')
      .upsert(
        { user_id: user.id, quest_id: questId, score },
        { onConflict: 'user_id,quest_id' },
      );
  } catch {
    queuePush({ questId, score });
  } finally {
    queueFlush();
  }
}

// --- Zone progress helpers -------------------------------------------------

type ZoneProgress = {
  zonesUnlocked: Record<string, boolean>;
  // keep any other existing fields in storage
  [key: string]: any;
};

const ZONE_STORAGE_KEY = 'nv_progress_v1';

function readZoneProgress(): ZoneProgress {
  if (typeof localStorage === 'undefined') return { zonesUnlocked: {} };
  try {
    const raw = localStorage.getItem(ZONE_STORAGE_KEY);
    if (!raw) return { zonesUnlocked: {} };
    const parsed = JSON.parse(raw);
    return {
      zonesUnlocked: parsed?.zonesUnlocked ?? {},
      ...parsed,
    } as ZoneProgress;
  } catch {
    return { zonesUnlocked: {} };
  }
}

function writeZoneProgress(next: ZoneProgress) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(ZONE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore write errors */
  }
}

/**
 * Return the set of unlocked zone ids/slugs.
 * If you pass a world prefix (e.g. "thailandia"), it filters to that world.
 */
export async function getUnlockedZones(worldPrefix?: string): Promise<Set<string>> {
  const p = readZoneProgress();
  const keys = Object.keys(p.zonesUnlocked || {}).filter((k) => p.zonesUnlocked[k]);
  if (!worldPrefix) return new Set(keys);
  const prefix = worldPrefix.endsWith(':') ? worldPrefix : `${worldPrefix}:`;
  return new Set(keys.filter((k) => k.startsWith(prefix)));
}

// Dev/demo helper to unlock a zone locally
export function localUnlockZone(_userId: string, slug: string) {
  const p = readZoneProgress();
  p.zonesUnlocked[slug] = true;
  writeZoneProgress(p);
}

// --- Remote progress helpers (streaks, badges) ---------------------------------

async function authHeader(): Promise<Record<string, string>> {
  try {
    const client = await getSupabase();
    if (!client) return {};
    const { data } = await client.auth.getSession();
    const t = data.session?.access_token;
    return t ? { "x-supabase-token": t } : {};
  } catch {
    return {};
  }
}

export async function markQuest(quest_id: string, action: "start" | "complete") {
  const headers = {
    "content-type": "application/json",
    ...(await authHeader()),
  } as Record<string, string>;
  const res = await fetch("/.netlify/functions/progress-update", {
    method: "POST",
    headers,
    body: JSON.stringify({ quest_id, action }),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function fetchProgress() {
  const headers = await authHeader();
  const res = await fetch("/.netlify/functions/progress-get", { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{
    progress: { quest_id: string; completed_at: string | null }[];
    streak: { current_streak: number; longest_streak: number };
    badges: { badge_code: string; earned_at: string }[];
  }>;
}


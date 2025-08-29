// src/lib/progress.ts
// Persists progress locally; syncs to Supabase when authed.

type Progress = { bestScore: number; completed: boolean; updatedAt: string };

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

export function getProgress(slug: string): Progress {
  const raw = localStorage.getItem(key(slug));
  if (!raw) return { bestScore: 0, completed: false, updatedAt: nowISO() };
  try {
    return JSON.parse(raw) as Progress;
  } catch {
    return { bestScore: 0, completed: false, updatedAt: nowISO() };
  }
}

export function setLocal(slug: string, p: Progress) {
  localStorage.setItem(key(slug), JSON.stringify(p));
}

export async function saveProgress(params: {
  slug: string;
  score: number;
  completed?: boolean;
}) {
  const { slug, score, completed = false } = params;
  const current = getProgress(slug);
  const bestScore = Math.max(current.bestScore || 0, score);
  const merged: Progress = {
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

export async function getCloudProgress(slug: string) {
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

    const merged: Progress = {
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


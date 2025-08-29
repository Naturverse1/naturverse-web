import { getSupabase } from '@/lib/supabase-client';

const LS_KEY = (userId: string) => `nv_unlocked_zones_${userId}`;
const QUEST_LS_KEY = 'nv.quest.progress.v1';

/**
 * Get unlocked zone slugs for a user.
 * Priority: Supabase -> localStorage -> empty.
 *
 * Expected schemas (choose whichever exists in your DB):
 * 1) zone_unlocks: { user_id: string; zone_slug: string }
 * 2) stamps table with zone_slug column: { user_id: string; zone_slug: string }
 */
export async function getUnlockedZones(userId: string): Promise<Set<string>> {
  if (!userId) return new Set();

  // Try 1: explicit unlocks table
  const supabase = getSupabase();
  if (supabase) {
    const { data: unlocks1, error: e1 } = await supabase
      .from('zone_unlocks')
      .select('zone_slug')
      .eq('user_id', userId);

    if (!e1 && unlocks1 && unlocks1.length) {
      return new Set(unlocks1.map((r) => r.zone_slug));
    }

    // Try 2: infer from stamps table if it has zone_slug
    const { data: unlocks2, error: e2 } = await supabase
      .from('stamps')
      .select('zone_slug')
      .eq('user_id', userId);

    if (!e2 && unlocks2 && unlocks2.length && 'zone_slug' in (unlocks2[0] ?? {})) {
      return new Set(unlocks2.map((r: any) => r.zone_slug).filter(Boolean));
    }
  }

  // Fallback: localStorage
  try {
    const raw = localStorage.getItem(LS_KEY(userId));
    const arr: string[] = raw ? JSON.parse(raw) : [];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

/** Dev utility: locally mark a zone unlocked (for demos) */
export function localUnlockZone(userId: string, slug: string) {
  try {
    const key = LS_KEY(userId);
    const arr: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    if (!arr.includes(slug)) arr.push(slug);
    localStorage.setItem(key, JSON.stringify(arr));
  } catch {}
}

type QuestProgress = Record<
  string,
  {
    status: 'new' | 'started' | 'completed';
    score: number;
    updatedAt: string;
  }
>;

function readQuestLocal(): QuestProgress {
  try {
    return JSON.parse(localStorage.getItem(QUEST_LS_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeQuestLocal(p: QuestProgress) {
  localStorage.setItem(QUEST_LS_KEY, JSON.stringify(p));
}

export async function saveProgress(
  slug: string,
  score: number,
  status: QuestProgress[string]['status'],
) {
  const now = new Date().toISOString();
  const state = readQuestLocal();
  state[slug] = { status, score, updatedAt: now };
  writeQuestLocal(state);

  const supabase = getSupabase();
  if (supabase) {
    const { data: user } = await supabase.auth.getUser();
    if (user?.user) {
      await supabase.from('quest_progress').upsert(
        {
          user_id: user.user.id,
          quest_slug: slug,
          score,
          status,
          updated_at: now,
        },
        { onConflict: 'user_id,quest_slug' },
      );
    }
  }
}

export function getProgress(slug: string) {
  const state = readQuestLocal();
  return state[slug] ?? { status: 'new' as const, score: 0, updatedAt: '' };
}

export function getAllProgress() {
  return JSON.parse(localStorage.getItem(QUEST_LS_KEY) || '{}') as Record<string, any>;
}

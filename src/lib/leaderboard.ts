// src/lib/leaderboard.ts
// Helpers for quest leaderboards and queued score writes

type LeaderboardRow = { rank: number; name: string | null; score: number; time: string };
type QueueItem = { questId: string; score: number };

const QUEUE_KEY = 'nv:score-queue';

let supabase: any | null = null;
async function getSupabase() {
  if (supabase) return supabase;
  try {
    const mod = await import('../lib/supabase-client');
    supabase = (mod as any).supabase || (mod as any).default || null;
  } catch {
    supabase = null;
  }
  return supabase;
}

export async function fetchLeaderboard(questId: string, limit = 10): Promise<LeaderboardRow[]> {
  try {
    const client = await getSupabase();
    if (!client) return [];
    const { data } = await client
      .from('quest_leaderboard_public')
      .select('rank, username, score, created_at')
      .eq('quest_slug', questId)
      .order('score', { ascending: false })
      .limit(limit);
    return (data ?? []).map((r: any) => ({
      rank: r.rank,
      name: r.username ?? null,
      score: r.score,
      time: r.created_at,
    }));
  } catch {
    return [];
  }
}

export function queuePush(item: QueueItem) {
  if (typeof localStorage === 'undefined') return;
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const arr: QueueItem[] = raw ? JSON.parse(raw) : [];
    arr.push(item);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(arr));
  } catch {
    /* ignore */
  }
}

export async function queueFlush() {
  if (typeof localStorage === 'undefined') return;
  let arr: QueueItem[] = [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (raw) arr = JSON.parse(raw) as QueueItem[];
  } catch {
    arr = [];
  }
  if (arr.length === 0) return;
  try {
    const client = await getSupabase();
    if (!client) return;
    const { data: userRes } = await client.auth.getUser();
    const user = userRes?.user;
    if (!user) return;
    const remaining: QueueItem[] = [];
    for (const item of arr) {
      try {
        await client
          .from('quest_scores')
          .upsert(
            { user_id: user.id, quest_id: item.questId, score: item.score },
            { onConflict: 'user_id,quest_id' },
          );
      } catch {
        remaining.push(item);
      }
    }
    if (remaining.length) {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));
    } else {
      localStorage.removeItem(QUEUE_KEY);
    }
  } catch {
    /* ignore */
  }
}


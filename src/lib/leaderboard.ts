// src/lib/leaderboard.ts
type Row = { rank: number; username: string | null; best_score: number };

let supabase: any | null = null;
async function getSupabase() {
  if (supabase) return supabase;
  try {
    const mod = await import('../lib/supabase-client');
    supabase = (mod as any).supabase || (mod as any).default || null;
  } catch { supabase = null; }
  return supabase;
}

export async function getLeaderboard(slug: string, limit = 10): Promise<Row[]> {
  try {
    const client = await getSupabase();
    if (!client) return [];
    const { data } = await client
      .from('quest_leaderboard_public')
      .select('rank, username, best_score')
      .eq('quest_slug', slug)
      .order('best_score', { ascending: false })
      .limit(limit);
    return (data ?? []) as Row[];
  } catch {
    return [];
  }
}

export async function upsertLeaderboard(slug: string, score: number) {
  try {
    const client = await getSupabase();
    if (!client) return;
    const { data: userRes } = await client.auth.getUser();
    const user = userRes?.user;
    if (!user) return;

    await client.from('quest_progress').upsert(
      { user_id: user.id, quest_slug: slug, best_score: score, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,quest_slug' },
    );
  } catch {
    /* ignore */
  }
}

import { getSupabase } from '@/lib/supabase-client';

export type LeaderboardEntry = {
  user_id: string;
  username?: string | null;
  best_score: number;
  rank: number;
};

export async function getLeaderboard(
  questSlug: string,
  { limit = 10 } = {},
) {
  const supabase = getSupabase();
  if (!supabase) return { top: [], self: null };

  const { data: user } = await supabase.auth.getUser();
  const userId = user?.user?.id || null;

  const { data: rows } = await supabase
    .from('quest_leaderboard_public')
    .select('user_id, username, best_score, rank')
    .eq('quest_slug', questSlug)
    .order('rank', { ascending: true })
    .limit(limit);

  let self = null;
  if (userId) {
    const { data: mine } = await supabase
      .from('quest_leaderboard_public')
      .select('user_id, username, best_score, rank')
      .eq('quest_slug', questSlug)
      .eq('user_id', userId)
      .maybeSingle();
    if (mine) self = mine as LeaderboardEntry;
  }

  return { top: (rows as LeaderboardEntry[]) || [], self };
}

export async function upsertLeaderboard({
  questSlug,
  score,
}: {
  questSlug: string;
  score: number;
}) {
  const supabase = getSupabase();
  if (!supabase) return;
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return;
  const now = new Date().toISOString();
  await supabase.from('quest_progress').upsert(
    {
      user_id: user.user.id,
      quest_slug: questSlug,
      best_score: score,
      completed: true,
      updated_at: now,
    },
    { onConflict: 'user_id,quest_slug' },
  );
}

import { getSupabase } from './supabase-client';

export type MiniQuest = { title: string; description: string; sort?: number };

const FALLBACK: MiniQuest[] = [
  { title: 'Explore Thailandia', description: 'Visit the first kingdom and meet Turian.', sort: 1 },
  { title: 'Earn Your First Stamp', description: 'Complete a quiz and unlock a passport stamp.', sort: 2 },
  { title: 'Meet a Friend', description: 'Say hello to Coconut Cruze in Lotus Lake.', sort: 3 },
];

/**
 * Fetch quests from Supabase. Falls back to the local list when:
 * - Supabase client is not available in this environment
 * - Query fails
 * - No rows are returned
 */
export async function fetchMiniQuests(): Promise<MiniQuest[]> {
  const supabase = getSupabase();
  if (!supabase) return FALLBACK;
  try {
    const { data, error } = await supabase
      .from('mini_quests_public')
      .select('title, description, sort')
      .order('sort', { ascending: true });

    if (error) return FALLBACK;
    if (!data || data.length === 0) return FALLBACK;

    return data as MiniQuest[];
  } catch {
    return FALLBACK;
  }
}


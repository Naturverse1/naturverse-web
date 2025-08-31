import { getSupabase } from '@/lib/supabase-client';

// --------------------
// XP Ledger
// --------------------
export async function addXp(userId: string, amount: number, reason: string) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('xp_ledger' as any)
    .insert({ user_id: userId, amount, reason } as any)
    .select();
  if (error) throw error;
  return data;
}

export async function getXpTotal(userId: string) {
  const supabase = getSupabase();
  if (!supabase) return 0;
  const { data, error } = await supabase
    .from('xp_ledger' as any)
    .select('amount')
    .eq('user_id', userId);

  if (error) throw error;
  return (
    data?.reduce(
      (sum: number, row: { amount: number }) => sum + row.amount,
      0,
    ) || 0
  );
}

export async function getXpHistory(userId: string) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('xp_ledger' as any)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// --------------------
// Badges
// --------------------
export async function awardBadge(userId: string, badgeName: string) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('badges' as any)
    .insert({ user_id: userId, badge_name: badgeName } as any)
    .select();
  if (error) throw error;
  return data;
}

export async function getBadges(userId: string) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('badges' as any)
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

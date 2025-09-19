import { supabase } from '@/lib/supabaseClient';

// --------------------
// XP Ledger
// --------------------
export async function addXp(userId: string, amount: number, reason: string) {
  const { data, error } = await supabase
    .from('xp_ledger')
    .insert({ user_id: userId, amount, reason })
    .select();
  if (error) throw error;
  return data;
}

export async function getXpTotal(userId: string) {
  const { data, error } = await supabase
    .from('xp_ledger')
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
  const { data, error } = await supabase
    .from('xp_ledger')
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
  const { data, error } = await supabase
    .from('badges')
    .insert({ user_id: userId, badge_name: badgeName })
    .select();
  if (error) throw error;
  return data;
}

export async function getBadges(userId: string) {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}

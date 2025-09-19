import { confettiBurst } from './confetti';
import { supabase as sharedSupabase } from './supabase-client';

const sb = sharedSupabase;

type StampGrant = { world: string; inc?: number };

const LOCAL_KEY = 'naturverse.passport.local';
function getLocal() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
  } catch { return {}; }
}
function setLocal(d: any) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(d));
}

export async function grantStamp({ world, inc = 1 }: StampGrant) {
  const data = getLocal();
  data.worlds = data.worlds || {};
  data.worlds[world] = (data.worlds[world] || 0) + inc;
  setLocal(data);
  confettiBurst();
  if (!sb) return;
  try {
    const { data: { user } } = await sb.auth.getUser();
    const uid = user?.id;
    if (!uid) return;
    await sb.rpc('grant_world_stamp', { p_user: uid, p_world: world, p_inc: inc });
  } catch {
    // ignore errors
  }
}

export async function postScore(game: string, value: number) {
  if (!sb) return;
  try {
    const { data: { user } } = await sb.auth.getUser();
    await sb.from('scores').insert({ game, value, user_id: user?.id ?? null });
  } catch {
    // ignore errors
  }
}

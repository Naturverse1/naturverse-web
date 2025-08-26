import { confettiBurst } from './confetti';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const sb = (supabaseUrl && supabaseAnon)
  ? createClient(supabaseUrl, supabaseAnon)
  : null;

type StampGrant = { world: string; inc?: number; reason?: string };

const LOCAL_KEY = 'naturverse.passport.local';
function getLocalPassport() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}'); } catch { return {}; }
}
function setLocalPassport(data: any) { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); }

/** Grant a world stamp locally, and upsert in Supabase if available. */
export async function grantStamp({ world, inc = 1 }: StampGrant) {
  // Local (always)
  const data = getLocalPassport();
  data.worlds = data.worlds || {};
  data.worlds[world] = (data.worlds[world] || 0) + inc;
  setLocalPassport(data);
  confettiBurst();

  // Cloud (if signed in + sb present)
  try {
    if (!sb) return;
    const { data: { user } } = await sb.auth.getUser();
    const uid = user?.id;
    if (!uid) return;
    // use RPC if available, else client upsert
    const rpc = await sb.rpc('grant_world_stamp', { p_user: uid, p_world: world, p_inc: inc });
    if (rpc.error) {
      // fallback: insert or update
      await sb.from('user_world_stamps').upsert(
        { user_id: uid, world, count: inc, last_granted_at: new Date().toISOString() },
        { onConflict: 'user_id,world', ignoreDuplicates: false }
      );
    }
  } catch {}
}

/** Post a score safely */
export async function postScore(game: string, value: number) {
  try {
    if (!sb) return; // silently no-op in local demo
    const { data: { user } } = await sb.auth.getUser();
    const uid = user?.id ?? null;
    await sb.from('scores').insert({ game, value, user_id: uid });
  } catch {}
}

// ---- SAFE AUTO-STAMPS (per world, at most 1x / day) ----
const FLAG = process.env.NEXT_PUBLIC_ENABLE_AUTO_STAMPS === 'true';
const AUTO_KEY = 'naturverse.autoStamp.last'; // { [world]: ISO-string }

function canAutoGrant(world: string) {
  if (!FLAG) return false;
  try {
    const map = JSON.parse(localStorage.getItem(AUTO_KEY) || '{}') as Record<string, string>;
    const last = map[world] ? new Date(map[world]) : null;
    if (!last) return true;
    const now = new Date();
    const sameDay =
      last.getFullYear() === now.getFullYear() &&
      last.getMonth() === now.getMonth() &&
      last.getDate() === now.getDate();
    return !sameDay;
  } catch {
    return FLAG;
  }
}

function markAutoGrant(world: string) {
  try {
    const map = JSON.parse(localStorage.getItem(AUTO_KEY) || '{}') as Record<string, string>;
    map[world] = new Date().toISOString();
    localStorage.setItem(AUTO_KEY, JSON.stringify(map));
  } catch {}
}

/** Grant once per day per world (local + cloud), with confetti; no-ops if disabled. */
export async function autoGrantOncePerDay(world: string) {
  if (!canAutoGrant(world)) return false;
  await grantStamp({ world, inc: 1 });
  markAutoGrant(world);
  return true;
}

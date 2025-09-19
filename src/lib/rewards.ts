import { confettiBurst } from './confetti';
import { supabase as sharedSupabase } from '@/lib/supabase-client';

const sb = sharedSupabase;

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

// --- AUTO STAMPS (feature-flagged, once-per-day per world) ---
const enableAutoStamps = () => {
  const fromImportMeta = (() => {
    try {
      const env = import.meta.env as Record<string, string | undefined>;
      return env.NEXT_PUBLIC_ENABLE_AUTO_STAMPS ?? env.VITE_ENABLE_AUTO_STAMPS;
    } catch {
      return undefined;
    }
  })();
  const fromProcess = typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_ENABLE_AUTO_STAMPS : undefined;
  return (fromImportMeta ?? fromProcess) === 'true';
};

const AUTO_FLAG = typeof window !== 'undefined' && enableAutoStamps();
const AUTO_KEY = 'naturverse.autoStamp.last'; // { [world]: ISO }

function readAuto(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(AUTO_KEY) || '{}') as Record<string,string>; } catch { return {}; }
}
function writeAuto(map: Record<string,string>) {
  try { localStorage.setItem(AUTO_KEY, JSON.stringify(map)); } catch {}
}
function canAutoGrant(world: string) {
  if (!AUTO_FLAG) return false;
  const map = readAuto();
  const prev = map[world];
  if (!prev) return true;
  const last = new Date(prev); const now = new Date();
  const sameDay = last.getFullYear()===now.getFullYear() && last.getMonth()===now.getMonth() && last.getDate()===now.getDate();
  return !sameDay;
}
function mark(world: string) {
  const map = readAuto(); map[world] = new Date().toISOString(); writeAuto(map);
}

/** Grant once per day per world; returns true if granted. */
export async function autoGrantOncePerDay(world: string) {
  try {
    if (!canAutoGrant(world)) return false;
    // reuse your existing grant function; falls back to local if offline
    const ok = await (typeof grantStamp === 'function'
      ? grantStamp({ world, inc: 1 })
      : Promise.resolve(true));
    mark(world);
    window.dispatchEvent(new CustomEvent('natur:stamp-granted', { detail: { world } }));
    return !!ok;
  } catch { return false; }
}

/** Dev helper: add ?stamps=reset to URL to clear daily throttle (dev only) */
if (typeof window !== 'undefined') {
  const p = new URLSearchParams(location.search);
  if (p.get('stamps') === 'reset') localStorage.removeItem(AUTO_KEY);
}

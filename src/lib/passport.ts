import type { PassportStamp } from '../types/passport';

const STAMP_KEY = 'naturverse.passport.stamps.v1';
const MAX_STAMPS = 60;

const read = (): PassportStamp[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STAMP_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean) as PassportStamp[];
  } catch {
    return [];
  }
};

const write = (list: PassportStamp[]) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STAMP_KEY, JSON.stringify(list)); } catch {}
};

const newId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `stamp-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
};

export type DemoStamp = PassportStamp;

/** Add a local/demo passport stamp and broadcast a change event. */
export function demoAddStamp(world: string, note?: string): DemoStamp | null {
  const trimmedWorld = world?.trim();
  if (!trimmedWorld) return null;

  const label = note?.trim();
  const stamp: PassportStamp = {
    id: newId(),
    user_id: 'local',
    world: trimmedWorld,
    title: label || 'Quest Reward',
    note: label ? 'Quest completed with Turian' : 'Quest reward from Turian',
    created_at: new Date().toISOString(),
  };

  try {
    const existing = read();
    const next = [stamp, ...existing];
    write(next.slice(0, MAX_STAMPS));
  } catch {}

  try {
    window.dispatchEvent(new CustomEvent('natur:stamp-granted', { detail: { world: trimmedWorld, stamp } }));
  } catch {}

  return stamp;
}

export * from './passport/store';

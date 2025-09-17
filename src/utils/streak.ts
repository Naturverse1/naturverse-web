const STREAK_STORAGE_KEY = 'natur:questStreak:v1';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export type StreakState = { count: number; last: Date | null };

const fallbackState: StreakState = { count: 0, last: null };

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

const parseStoredStreak = (raw: unknown): StreakState => {
  if (!raw || typeof raw !== 'object') return fallbackState;
  const record = raw as { count?: unknown; last?: unknown };
  const count = Number.isFinite(record.count) ? Math.max(0, Math.floor(Number(record.count))) : 0;
  if (typeof record.last !== 'string') {
    return { count, last: null };
  }
  const parsed = new Date(record.last);
  return Number.isNaN(parsed.getTime()) ? { count, last: null } : { count, last: parsed };
};

export function getStreak(): StreakState {
  if (typeof window === 'undefined') return fallbackState;
  try {
    const raw = window.localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) return fallbackState;
    const parsed = JSON.parse(raw);
    return parseStoredStreak(parsed);
  } catch {
    return fallbackState;
  }
}

export function bumpStreak(referenceDate: Date = new Date()): number {
  if (typeof window === 'undefined') return 0;
  const { count, last } = getStreak();
  let nextCount = 1;
  if (last) {
    if (isSameDay(last, referenceDate)) {
      nextCount = Math.max(1, count);
    } else {
      const yesterday = new Date(referenceDate.getTime() - ONE_DAY_MS);
      if (isSameDay(last, yesterday)) {
        nextCount = Math.max(1, count + 1);
      }
    }
  }
  try {
    window.localStorage.setItem(
      STREAK_STORAGE_KEY,
      JSON.stringify({ count: nextCount, last: referenceDate.toISOString() }),
    );
  } catch {}
  return nextCount;
}

export function clearStreak(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STREAK_STORAGE_KEY);
  } catch {}
}

const HISTORY_STORAGE_KEY = 'natur:questHistory:v1';
const BALANCE_STORAGE_KEY = 'natur:bankBalance';
const DEFAULT_BALANCE = 120;

export type QuestRewardEntry = {
  when: string;
  type: 'grant';
  amount: number;
  note: string;
};

const sanitizeHistory = (raw: unknown): QuestRewardEntry[] => {
  if (!Array.isArray(raw)) return [];
  const entries: QuestRewardEntry[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const record = item as { when?: unknown; type?: unknown; amount?: unknown; note?: unknown };
    if (record.type !== 'grant') continue;
    const when = typeof record.when === 'string' ? record.when : '';
    const note = typeof record.note === 'string' ? record.note : '';
    const amount = Number.isFinite(record.amount) ? Math.max(0, Math.round(Number(record.amount))) : 0;
    if (!when || !note || amount <= 0) continue;
    entries.push({ when, type: 'grant', amount, note });
  }
  return entries;
};

export function grantReward(amount: number, note: string): QuestRewardEntry | null {
  if (typeof window === 'undefined') return null;
  const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.round(Number(amount))) : 0;
  if (safeAmount <= 0) return null;
  const entryNote = note?.trim() || 'Quest reward';
  const entry: QuestRewardEntry = {
    when: new Date().toISOString(),
    type: 'grant',
    amount: safeAmount,
    note: entryNote,
  };

  try {
    const existingRaw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    const existing = existingRaw ? sanitizeHistory(JSON.parse(existingRaw)) : [];
    const next = [entry, ...existing];
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
  } catch {
    try { window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([entry])); } catch {}
  }

  const currentRaw = window.localStorage.getItem(BALANCE_STORAGE_KEY);
  const parsedBalance = Number.isFinite(Number(currentRaw)) ? Number(currentRaw) : Number.NaN;
  const currentBalance = Number.isNaN(parsedBalance) ? DEFAULT_BALANCE : Math.round(parsedBalance);
  try {
    window.localStorage.setItem(BALANCE_STORAGE_KEY, String(currentBalance + safeAmount));
  } catch {}

  return entry;
}

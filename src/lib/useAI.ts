const CACHE_PREFIX = "naturverse.ai";

export type AIPurpose = "navatar" | "card" | "lesson";

type CacheValue<T> = {
  data: T;
};

const LINK_PATTERN = /(https?:\/\/\S+|www\.\S+)/gi;
const UNSAFE_CHARS = /[<>]/g;

function cacheKey(purpose: AIPurpose, input: unknown) {
  try {
    return `${CACHE_PREFIX}:${purpose}:${JSON.stringify(input)}`;
  } catch {
    return `${CACHE_PREFIX}:${purpose}`;
  }
}

function readCache<T>(key: string): T | null {
  if (typeof window === "undefined" || !window?.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheValue<T>;
    return parsed.data ?? null;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, value: T) {
  if (typeof window === "undefined" || !window?.localStorage) return;
  try {
    const payload: CacheValue<T> = { data: value };
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // ignore storage quota or privacy mode failures
  }
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    let clean = value.replace(LINK_PATTERN, "");
    clean = clean.replace(UNSAFE_CHARS, "");
    clean = clean.replace(/javascript:/gi, "");
    clean = clean.replace(/\s{2,}/g, " ");
    return clean.trim();
  }
  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item));
  }
  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      next[key] = sanitizeValue(val);
    }
    return next;
  }
  return value;
}

export async function ai<T>(purpose: AIPurpose, input: unknown): Promise<T> {
  const key = cacheKey(purpose, input);
  const cached = readCache<T>(key);
  if (cached) {
    return cached;
  }

  const response = await fetch("/.netlify/functions/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ purpose, input }),
  });

  if (!response.ok) {
    throw new Error(`AI error (${response.status})`);
  }

  const json = await response.json();
  if (!json.ok) {
    throw new Error(json.error || "AI error");
  }

  const cleaned = sanitizeValue(json.data) as T;
  writeCache(key, cleaned);
  return cleaned;
}

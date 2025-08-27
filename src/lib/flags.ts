// tiny runtime flags loader with hard fallback
export type Flags = { telemetry: boolean };
const fallback: Flags = { telemetry: false };

let cache: Flags | null = null;
export async function loadFlags(): Promise<Flags> {
  if (cache) return cache;
  try {
    const res = await fetch('/flags.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('flags fetch failed');
    cache = (await res.json()) as Flags;
    return cache;
  } catch {
    return fallback;
  }
}


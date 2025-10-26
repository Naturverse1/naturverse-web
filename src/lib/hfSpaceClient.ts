export type PollResult =
  | { done: false }
  | { done: true; image: string; raw?: unknown };

export async function pollResult(eventId: string): Promise<PollResult> {
  const res = await fetch(
    `/.netlify/functions/hf-space-result?id=${encodeURIComponent(eventId)}`,
    {
      cache: "no-store",
    },
  );

  // 202 = still running; keep polling
  if (res.status === 202) return { done: false };

  if (!res.ok) {
    throw new Error(`Space result error (${res.status})`);
  }

  const data = await res.json();
  if (data?.image) {
    return { done: true, image: data.image, raw: data.raw };
  }

  return { done: false };
}

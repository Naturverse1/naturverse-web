export function normalizeSpaceUrl(raw?: string) {
  if (!raw) return "";
  const trimmed = raw.trim();
  const withProto = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
  return withProto.replace(/\/+$/, "");
}

export function getSpaceUrl() {
  const env =
    import.meta.env?.HF_SPACE_URL ||
    import.meta.env?.VITE_HF_SPACE_URL ||
    import.meta.env?.HUGGINGFACE_SPACE_URL ||
    import.meta.env?.VITE_HUGGINGFACE_SPACE_URL;
  return normalizeSpaceUrl(env);
}

export async function startGeneration(payload: any) {
  const res = await fetch("/.netlify/functions/hf-space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const message = (await safeText(res)) || "Space request failed";
    throw new Error(message);
  }
  const json = await res.json().catch(() => ({}));
  const rawId = json?.id ?? json?.eventId;
  const id =
    typeof rawId === "string"
      ? rawId
      : typeof rawId === "number"
      ? String(rawId)
      : null;
  if (!id) {
    throw new Error("No EVENT_ID from Space");
  }
  return id;
}

export async function pollResult(
  id: string,
  { timeoutMs = 120_000, intervalMs = 2_000 }: { timeoutMs?: number; intervalMs?: number } = {}
) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const response = await fetch(`/.netlify/functions/hf-space-result?id=${encodeURIComponent(id)}`);
    if (response.status === 202) {
      await wait(intervalMs);
      continue;
    }
    if (!response.ok) {
      throw new Error(await safeText(response) || "Space result failed");
    }
    const json = await response.json().catch(() => ({}));
    if (json?.imageUrl) {
      return json.imageUrl as string;
    }
    throw new Error("Malformed result from Space");
  }
  throw new Error("Space result timed out");
}

async function safeText(response: Response) {
  try {
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      if (json && typeof json === "object") {
        if (typeof json.error === "string" && json.error) {
          return json.error;
        }
        if (Array.isArray(json.errors) && json.errors.length > 0) {
          const first = json.errors.find(
            (entry: unknown): entry is string => typeof entry === "string"
          );
          if (first) return first;
        }
      }
    } catch {
      // Ignore JSON parse errors and fall back to raw text
    }
    return text;
  } catch {
    return "";
  }
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

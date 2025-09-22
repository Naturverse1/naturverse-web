const envSpaceUrl = import.meta.env.PUBLIC_HUGGINGFACE_SPACE_URL;
const windowSpaceUrl =
  typeof window !== "undefined" ? (window as any).__HUGGINGFACE_SPACE_URL__ : undefined;

const SPACE_URL = [envSpaceUrl, windowSpaceUrl].find(
  (value): value is string => typeof value === "string" && value.trim() !== "" && !value.includes("%")
) ?? "";

if (!SPACE_URL) {
  // We fail early with a helpful message that matches your toast
  // so it’s obvious what’s wrong on Preview deploys.
  console.warn("HUGGINGFACE_SPACE_URL is not set");
}

type InferResult =
  | { status: "ok"; images: string[] }
  | { status: "error"; message: string };

const POST_PATH = "/gradio_api/call/infer";
const RESULT_PATH = "/gradio_api/call/infer";

async function postInfer(data: any[]): Promise<string> {
  const res = await fetch(`${SPACE_URL}${POST_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Space POST failed (${res.status}): ${text}`);
  }
  // Gradio returns a JSON with an "event_id"
  const json = await res.json();
  const id = json?.event_id || json?.eventId || json?.data?.[0];
  if (!id) throw new Error("Space did not return an event_id");
  return id;
}

async function getResult(eventId: string, signal?: AbortSignal) {
  const res = await fetch(`${SPACE_URL}${RESULT_PATH}/${eventId}`, { signal });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Space GET failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function runSpace(
  data: any[],
  opts: { maxWaitMs?: number; pollEveryMs?: number } = {}
): Promise<InferResult> {
  if (!SPACE_URL) {
    return { status: "error", message: "HF_SPACE_URL not set" };
  }

  const maxWaitMs = opts.maxWaitMs ?? 120_000; // 2 minutes
  const pollEveryMs = opts.pollEveryMs ?? 1500;

  const eventId = await postInfer(data);

  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    // Abort individual GETs to avoid dangling requests
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 25_000);

    try {
      const json = await getResult(eventId, ctrl.signal);
      clearTimeout(t);

      // Gradio result shapes vary by template; cover common cases:
      // - { data: ["data:image/png;base64,..."] }
      // - { success: true, data: [...] }
      // - { status: "COMPLETE", output: [...] }
      const imgs =
        json?.data?.filter((x: any) => typeof x === "string" && x.startsWith("data:image")) ??
        json?.output?.filter((x: any) => typeof x === "string" && x.startsWith("data:image")) ??
        [];

      if (imgs.length) return { status: "ok", images: imgs };

      // If the job is still running, many spaces return a stage/status field.
      const stage = json?.stage || json?.status || json?.state;
      if (stage && `${stage}`.toLowerCase() !== "complete") {
        await new Promise((r) => setTimeout(r, pollEveryMs));
        continue;
      }

      // If we get here with no images, surface whatever we got
      return {
        status: "error",
        message: json?.message || "Space returned no images",
      };
    } catch (err: any) {
      clearTimeout(t);
      // If aborted due to per-request timeout, keep polling
      if (err?.name === "AbortError") {
        await new Promise((r) => setTimeout(r, pollEveryMs));
        continue;
      }
      // Hard error from the Space
      return { status: "error", message: err?.message || "Space error" };
    }
  }

  return { status: "error", message: "Space timed out" };
}

export type { InferResult };

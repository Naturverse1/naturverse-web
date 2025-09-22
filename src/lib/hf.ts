// Browser utilities used by the Navatar page

export type StartOk = { ok: true; eventId: string };
export type StartErr = { ok: false; error: string };
export type StartResp = StartOk | StartErr;

export type PollDone = { ok: true; done: true; imageUrl: string };
export type PollWait = { ok: true; done: false };
export type PollErr  = { ok: false; error: string };
export type PollResp = PollDone | PollWait | PollErr;

export async function startJob(payload: any): Promise<StartResp> {
  const res = await fetch("/.netlify/functions/hf-space", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  });
  return res.json();
}

export async function pollJob(eventId: string): Promise<PollResp> {
  const url = `/.netlify/functions/hf-space-result?eventId=${encodeURIComponent(eventId)}`;
  const res = await fetch(url, { method: "GET", cache: "no-store" });
  return res.json();
}

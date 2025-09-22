// GET /.netlify/functions/hf-space-result?eventId=...
// Polls the Space for the result, returns {done,imageUrl} | {done:false}

import type { Handler } from "@netlify/functions";
import { getSpaceUrl, fetchWithRetry, type PollResponse } from "./_hf";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return json({ ok: false, error: "Method Not Allowed" }, 405);
  }

  const eventId = event.queryStringParameters?.eventId ?? "";
  if (!eventId) {
    return json({ ok: false, error: "Missing eventId" }, 400);
  }

  try {
    const space = getSpaceUrl();
    const url = `${space}/gradio_api/call/infer/${encodeURIComponent(eventId)}`;

    const res = await fetchWithRetry(url, { method: "GET" });
    if (!res.ok) {
      return json({ ok: false, error: `HF poll failed: ${res.status}` }, res.status);
    }

    const j = await res.json().catch(() => null);
    const out: PollResponse = parseGradioResult(j);
    return json(out, 200);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return json({ ok: false, error: message }, 500);
  }
};

function parseGradioResult(j: any): PollResponse {
  if (!j || (j.status && String(j.status).toUpperCase() !== "COMPLETE" && !j.data)) {
    return { ok: true, done: false };
  }
  const data0 = Array.isArray(j?.data) ? j.data[0] : null;
  const url: string | undefined = data0?.url || data0?.path;
  if (url && /^https?:\/\//.test(url)) {
    return { ok: true, done: true, imageUrl: url };
  }
  const b64 = data0?.data || data0?.base64;
  if (b64 && typeof b64 === "string") {
    return { ok: true, done: true, imageUrl: `data:image/png;base64,${b64}` };
  }
  return { ok: true, done: false };
}

function json(data: any, status = 200) {
  return {
    statusCode: status,
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  };
}

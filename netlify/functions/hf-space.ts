// POST /.netlify/functions/hf-space
// Starts a generation job on the HF Space and returns {eventId}

import type { Handler } from "@netlify/functions";
import { getSpaceUrl, fetchWithRetry, extractEventId, type StartResponse } from "./_hf";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json({ ok: false, error: "Method Not Allowed" }, 405);
  }

  try {
    const space = getSpaceUrl();

    const rawBody = event.isBase64Encoded && event.body
      ? Buffer.from(event.body, "base64").toString("utf8")
      : event.body || "";

    const url = `${space}/gradio_api/call/infer`;
    const res = await fetchWithRetry(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: rawBody,
    });

    if (!res.ok) {
      return json({ ok: false, error: `HF start failed: ${res.status}` }, res.status);
    }
    const eventId = await extractEventId(res);
    if (!eventId) {
      return json({ ok: false, error: "Could not parse eventId from HF." }, 502);
    }
    const out: StartResponse = { ok: true, eventId };
    return json(out, 200);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return json({ ok: false, error: message }, 500);
  }
};

function json(data: any, status = 200) {
  return {
    statusCode: status,
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  };
}

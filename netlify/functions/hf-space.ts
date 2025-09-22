import type { Handler } from "@netlify/functions";
import { HF_SPACE_HOST, fetchWithRetry, safeText } from "../../src/lib/_hf";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: JSON_HEADERS, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  if (!HF_SPACE_HOST) {
    return { statusCode: 500, headers: JSON_HEADERS, body: JSON.stringify({ error: "HF_SPACE_URL not configured" }) };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const data = payload?.data;
    if (!data) {
      return { statusCode: 400, headers: JSON_HEADERS, body: JSON.stringify({ error: "Missing data payload" }) };
    }

    const url = `${HF_SPACE_HOST}/gradio_api/call/infer`;
    const res = await fetchWithRetry(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });

    const contentType = res.headers.get("content-type") || "";
    if (!res.ok) {
      const body = await safeText(res);
      return {
        statusCode: res.status,
        headers: JSON_HEADERS,
        body: JSON.stringify({ error: "HF POST failed", detail: body }),
      };
    }

    if (!contentType.includes("application/json")) {
      const body = await safeText(res);
      return {
        statusCode: 502,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          error: "Unexpected response from Space (not JSON)",
          detail: body.slice(0, 800),
        }),
      };
    }

    const json = await res.json();
    const eventId = json?.event_id || json?.eventId || json?.data?.event_id;
    if (!eventId) {
      return {
        statusCode: 502,
        headers: JSON_HEADERS,
        body: JSON.stringify({ error: "Missing event_id from Space", json }),
      };
    }

    return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify({ eventId }) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { statusCode: 500, headers: JSON_HEADERS, body: JSON.stringify({ error: message }) };
  }
};

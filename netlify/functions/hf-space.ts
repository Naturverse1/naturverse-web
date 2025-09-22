// netlify/functions/hf-space.ts
import type { Handler } from "@netlify/functions";
import { getSpaceBase } from "../../src/lib/_hf";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 204, headers: cors() } as const;
    }
    if (event.httpMethod !== "POST") {
      return json(405, { error: "Use POST" });
    }

    const base = getSpaceBase();
    const body = JSON.parse(event.body || "{}");

    // Forward to Gradio /call/infer
    const r = await fetch(`${base}/gradio_api/call/infer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const text = await r.text();
      return json(r.status, { error: "Space call failed", detail: text });
    }

    const data = await r.json().catch(async () => ({ text: await r.text() }));
    // Expect { event_id: "..." }
    const event_id = (data && (data as any).event_id) || null;
    if (!event_id) {
      return json(502, { error: "No event_id from Space", data });
    }

    return json(200, { event_id, space: base });
  } catch (err: any) {
    return json(500, { error: err?.message || String(err) });
  }
};

function json(status: number, obj: any) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json", ...cors() },
    body: JSON.stringify(obj),
  };
}
function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  };
}

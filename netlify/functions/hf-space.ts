import type { Handler } from "@netlify/functions";
import { getSpaceBaseUrl } from "../../src/utils/_hf";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    const spaceBase = getSpaceBaseUrl();
    const payload = JSON.parse(event.body || "{}");

    const data = [
      String(payload.prompt ?? ""),
      String(payload.negativePrompt ?? ""),
      Number(payload.seed ?? 0),
      Boolean(payload.randomizeSeed ?? true),
      Number(payload.width ?? 1024),
      Number(payload.height ?? 1024),
      Number(payload.guidanceScale ?? 0),
      Number(payload.steps ?? 2),
    ];

    const resp = await fetch(`${spaceBase}/gradio_api/call/infer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });

    const text = await resp.text();

    let eventId = "";
    try {
      const j = JSON.parse(text);
      eventId = j?.event_id || "";
    } catch {
      const m =
        text.match(/"event_id"\s*:\s*"([^"]+)"/) ||
        text.match(/([A-Za-z0-9_-]{8,})/);
      eventId = m?.[1] || "";
    }

    if (!resp.ok || !eventId) {
      return { statusCode: 502, body: JSON.stringify({ error: "Failed to start job", details: text }) };
    }

    return { statusCode: 200, body: JSON.stringify({ eventId }) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: err?.message || "Server error" }) };
  }
};

// netlify/functions/hf-space-result.ts
import type { Handler } from "@netlify/functions";
import { getSpaceBase, extractImageUrl, resultUrls } from "../../src/lib/_hf";

export const handler: Handler = async (event) => {
  try {
    const { httpMethod, queryStringParameters } = event;
    if (httpMethod === "OPTIONS") return { statusCode: 204, headers: cors() } as const;
    if (httpMethod !== "GET") return json(405, { error: "Use GET" });

    const eventId = (queryStringParameters?.eventId || "").trim();
    if (!eventId) return json(400, { error: "Missing eventId" });

    const base = getSpaceBase();
    // Try JSON endpoint first
    for (const url of resultUrls(base, eventId)) {
      const r = await fetch(url, { method: "GET" });

      // Some Spaces send SSE (text/event-stream); prefer JSON when available
      const ctype = r.headers.get("content-type") || "";
      const bodyText = await r.text();

      if (ctype.includes("application/json") || bodyText.trim().startsWith("{") || bodyText.trim().startsWith("[")) {
        const data = safeJson(bodyText);
        if (!data) continue;

        // Common shapes:
        // { "data": [ {url|path|base64...}, ... ] }
        // or [ {url|path|base64...}, ... ]
        const payload = (data.data ?? data) as any;
        const img = extractImageUrl(base, payload);

        return json(200, {
          status: "complete",
          imageUrl: img,
          raw: data, // keep for debugging until you’re happy
        });
      }

      // SSE fallback: look for `event: complete` with `data: ...`
      const maybe = parseSseForComplete(bodyText);
      if (maybe) {
        const img = extractImageUrl(base, maybe);
        return json(200, { status: "complete", imageUrl: img, raw: maybe });
      }
    }

    return json(502, { status: "pending", error: "No JSON or complete SSE found yet" });
  } catch (err: any) {
    return json(500, { error: err?.message || String(err) });
  }
};

function parseSseForComplete(s: string): any | null {
  // naive but effective: find the last `event: complete` block, parse the next `data: ...` as JSON
  const blocks = s.split(/\n\n+/);
  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i];
    if (/\bevent:\s*complete\b/i.test(b)) {
      const m = b.match(/data:\s*(.+)$/m);
      if (!m) return null;
      return safeJson(m[1]);
    }
  }
  return null;
}

function safeJson(txt: string): any | null {
  try { return JSON.parse(txt); } catch { return null; }
}

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

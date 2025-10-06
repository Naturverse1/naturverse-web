import type { Handler } from "@netlify/functions";

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type,authorization",
  };
}

function json(body: Record<string, unknown> | string, statusCode = 200) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...cors() },
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
}

type RequestBody = {
  seed?: unknown;
};

type ApiSuccess = { ok: true; provider: "multavatar"; dataUrl: string };
type ApiError = { ok: false; code: string; error: string };

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json("", 204);
  }

  try {
    let body: RequestBody;
    try {
      body = JSON.parse(event.body || "{}") as RequestBody;
    } catch {
      return json({ ok: false, code: "multavatar_invalid_body", error: "Invalid JSON body" }, 400);
    }

    const seed = typeof body.seed === "string" ? body.seed.trim() : "";
    if (!seed) {
      return json({ ok: false, code: "multavatar_missing_seed", error: "Missing seed/name" }, 400);
    }

    const url = `https://api.multiavatar.com/${encodeURIComponent(seed)}.png`;
    const res = await fetch(url);
    if (!res.ok) {
      const errTxt = await res.text().catch(() => "");
      return json({ ok: false, code: `multavatar_${res.status}`, error: errTxt || "Multavatar error" }, res.status);
    }

    const buf = Buffer.from(await res.arrayBuffer());
    const payload: ApiSuccess = {
      ok: true,
      provider: "multavatar",
      dataUrl: `data:image/png;base64,${buf.toString("base64")}`,
    };
    return json(payload);
  } catch (err: any) {
    const payload: ApiError = {
      ok: false,
      code: "multavatar_exception",
      error: String(err?.message || err),
    };
    return json(payload, 500);
  }
};

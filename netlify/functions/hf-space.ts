import type { Handler } from "@netlify/functions";

function normalizeSpaceUrl(raw?: string | null) {
  if (!raw) return "";
  const trimmed = raw.trim();
  const withProto = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
  return withProto.replace(/\/+$/, "");
}

const SPACE_URL =
  normalizeSpaceUrl(process.env.HF_SPACE_URL) ||
  normalizeSpaceUrl(process.env.HUGGINGFACE_SPACE_URL);

export const handler: Handler = async (event) => {
  try {
    if (!SPACE_URL) {
      return resp(500, { errors: ["HF_SPACE_URL not set"] });
    }
    if (event.httpMethod !== "POST") {
      return resp(405, { errors: ["Method not allowed"] });
    }

    let prompt: string | undefined;
    try {
      const payload = JSON.parse(event.body || "{}");
      prompt = typeof payload?.prompt === "string" ? payload.prompt.trim() : undefined;
    } catch {
      return resp(400, { errors: ["Invalid JSON body"] });
    }

    if (!prompt) {
      return resp(400, { errors: ["Missing prompt"] });
    }

    const gradio = await fetch(`${SPACE_URL}/gradio_api/call/infer`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ data: [prompt] }),
    });

    if (!gradio.ok) {
      const raw = await gradio.text();
      return resp(gradio.status, { errors: ["Space request failed"], raw });
    }

    const data = await gradio.json().catch(() => null);
    const rawId = (data as any)?.event_id ?? (data as any)?.eventId ?? (data as any)?.id;
    const id =
      typeof rawId === "string"
        ? rawId
        : typeof rawId === "number"
        ? String(rawId)
        : null;

    if (!id) {
      return resp(502, { errors: ["Missing event id from Space"], raw: data });
    }

    return resp(200, { id });
  } catch (err: any) {
    return resp(500, { errors: ["Unhandled error"], raw: String(err?.message || err) });
  }
};

function resp(status: number, body: unknown) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

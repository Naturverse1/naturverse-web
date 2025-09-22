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
      return json(500, { error: "HF_SPACE_URL not set" });
    }

    const id = event.queryStringParameters?.id;
    if (!id) {
      return json(400, { error: "Missing id" });
    }

    const res = await fetch(`${SPACE_URL}/gradio_api/call/infer/${id}`, {
      method: "GET",
    });

    if (res.status === 202) {
      return json(202, { pending: true });
    }

    if (!res.ok) {
      const text = await res.text();
      return json(502, { error: text || "Space result failed" });
    }

    const data = await res.json();
    const first = data?.data?.[0];
    const candidate =
      (typeof first === "string" && first) ||
      first?.url ||
      first?.path ||
      first?.image?.url ||
      null;

    if (!candidate || typeof candidate !== "string") {
      return json(502, { error: "No image in Space response" });
    }

    const imageUrl = candidate.startsWith("http") || candidate.startsWith("data:image/")
      ? candidate
      : `${SPACE_URL}/${candidate.replace(/^\/+/, "")}`;

    return json(200, { imageUrl });
  } catch (err: any) {
    return json(500, { error: err?.message || "Unknown error" });
  }
};

function json(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

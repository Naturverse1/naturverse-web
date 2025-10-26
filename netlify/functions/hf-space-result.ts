import type { Handler } from "@netlify/functions";

const spaceBase = process.env.HUGGINGFACE_SPACE_URL!;
const TIMEOUT_MS = 8000; // keep each poll short

export const handler: Handler = async (event) => {
  const id = event.queryStringParameters?.id;
  if (!id) return { statusCode: 400, body: "Missing id" };
  if (!spaceBase) {
    return {
      statusCode: 500,
      body: JSON.stringify({ errors: ["HUGGINGFACE_SPACE_URL not set"] }),
    };
  }

  // Short-poll the Space. If it takes too long, bail out with 202 so the client retries.
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort("poll-timeout"), TIMEOUT_MS);

  try {
    const res = await fetch(
      `${spaceBase}/gradio_api/call/infer/${encodeURIComponent(id)}`,
      {
        // Do NOT keep this open forever. Netlify will 504.
        signal: ctrl.signal,
        headers: { Accept: "application/json" },
      },
    );

    const text = await res.text(); // Space returns JSON text
    clearTimeout(timeout);

    // If Space streams partials or “queued/in_progress”, treat as pending.
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      // keep raw
    }

    // Done if we see a dataURL image in json.data
    const image =
      json && Array.isArray(json.data)
        ? json.data.find(
            (value: unknown) =>
              typeof value === "string" && value.startsWith("data:image/"),
          )
        : null;

    if (!image) {
      // Not ready yet – keep polling from the client.
      return {
        statusCode: 202,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pending: true, last: json ?? text }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pending: false, image, raw: json }),
    };
  } catch (err: any) {
    clearTimeout(timeout);
    // Abort = just means try again soon
    if (err?.name === "AbortError" || String(err?.message).includes("poll-timeout")) {
      return { statusCode: 202, body: JSON.stringify({ pending: true }) };
    }
    return {
      statusCode: 502,
      body: JSON.stringify({ errors: ["Result fetch failed"], detail: String(err) }),
    };
  }
};

export default handler;

// Start a generation job on the Space. Returns { eventId }.
const { endpoints } = require("./_hf");

exports.handler = async (evt) => {
  try {
    if (evt.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const payload = JSON.parse(evt.body || "{}");

    // Minimal payload; you can add/rename fields freely on the client.
    const body = {
      data: [
        payload.prompt ?? "",
        payload.negative_prompt ?? "",
        payload.seed ?? 0,
        !!payload.randomize_seed,
        payload.width ?? 1024,
        payload.height ?? 1024,
        payload.guidance_scale ?? 0,
        payload.num_inference_steps ?? 2,
      ],
    };

    const { callInfer } = endpoints();

    const res = await fetch(callInfer, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: 502, body: `HF /call/infer failed: ${res.status} ${text}` };
    }

    const json = await res.json();
    const eventId = json.event_id || json.eventId;
    if (!eventId) {
      return { statusCode: 502, body: `No event_id in response: ${JSON.stringify(json)}` };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    };
  } catch (err) {
    return { statusCode: 500, body: `hf-space-start error: ${err.message}` };
  }
};

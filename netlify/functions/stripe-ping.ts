import type { Handler } from "@netlify/functions";

// No Stripe import here yet to avoid requiring secrets during build.
// This is just a smoke test endpoint.
export const handler: Handler = async () => {
  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ok: true, service: "stripe", ts: Date.now() })
  };
};

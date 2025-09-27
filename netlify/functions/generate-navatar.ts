import type { Handler } from "@netlify/functions";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "content-type,authorization",
};

/** Backward-compatible proxy. Prefer calling /netlify/functions/image-generate directly. */
export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }

  const target = process.env.URL
    ? `${process.env.URL}/.netlify/functions/image-generate`
    : "/.netlify/functions/image-generate";

  const res = await fetch(target, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: event.body || "{}",
  });

  const text = await res.text();
  return {
    statusCode: res.status,
    headers: { "Content-Type": "application/json", ...CORS },
    body: text,
  };
};

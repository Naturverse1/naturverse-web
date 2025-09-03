import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  // For now we keep it disabled to avoid costs:
  return {
    statusCode: 503,
    body: "Turian live mode is disabled. Set VITE_AI_MODE=live and implement provider.",
  };
};


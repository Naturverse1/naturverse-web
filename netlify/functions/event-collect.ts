import type { Handler } from '@netlify/functions';

// Always return 204; never throw. If env isn’t configured, just no-op.
export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 204 };
    // Optionally parse but ignore; this endpoint is intentionally inert in prod
    // const payload = JSON.parse(event.body || '{}');
    return { statusCode: 204 };
  } catch {
    return { statusCode: 204 };
  }
};
export default handler;


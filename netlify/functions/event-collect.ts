import type { Handler } from '@netlify/functions'

export const handler: Handler = async (evt) => {
  if (evt.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  return { statusCode: 204, body: '' } // always succeed; no logging for now
}


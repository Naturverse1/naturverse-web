import type { Handler } from '@netlify/functions';
import OpenAI from 'openai';

// Simple body schema (no extra deps)
type ReqBody = {
  name?: string;
  prompt: string; // short description typed by the user
};

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: cors,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let body: ReqBody | null = null;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const prompt = (body?.prompt || '').toString().trim();
  const name = (body?.name || 'Navatar').toString().trim();
  if (!prompt) {
    return {
      statusCode: 400,
      headers: cors,
      body: JSON.stringify({ error: 'Missing prompt' }),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: 'Server is missing OPENAI_API_KEY' }),
    };
  }

  try {
    const client = new OpenAI({ apiKey });
    // Generate a single PNG, 1024px, transparent background for better layering
    const result = await client.images.generate({
      model: 'gpt-image-1',
      prompt: `Cute, brand-friendly character icon: ${prompt}.
               Centered, simple background, crisp edges, high contrast,
               1:1 aspect, PNG.`,
      size: '1024x1024',
      background: 'transparent',
      n: 1,
      response_format: 'b64_json',
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      return {
        statusCode: 502,
        headers: cors,
        body: JSON.stringify({ error: 'Image generation returned no data' }),
      };
    }

    // Return as a data URL. Your client will upload it to Supabase storage.
    const imageUrl = `data:image/png;base64,${b64}`;
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', ...cors },
      body: JSON.stringify({ imageUrl, name }),
    };
  } catch (err: any) {
    const message =
      err?.response?.data?.error?.message || err?.message || 'Image generation failed';
    return {
      statusCode: 502,
      headers: cors,
      body: JSON.stringify({ error: message }),
    };
  }
};

export default handler;

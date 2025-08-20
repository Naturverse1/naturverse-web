import type { Handler } from '@netlify/functions';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;

export const handler: Handler = async (event) => {
  try {
    if (!OPENAI_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing OPENAI_API_KEY' }) };
    }
    const { messages = [] } = event.body ? JSON.parse(event.body) : {};

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: resp.status, body: JSON.stringify({ error: text }) };
    }

    const json = await resp.json();
    const reply = json.choices?.[0]?.message?.content ?? '';
    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};

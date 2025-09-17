import type { Handler } from '@netlify/functions';

const MODEL = 'llama-3.1-8b-instant'; // fast, consistent
const SYS = `You are Turian the Durian — cheerful, brief, family-friendly. 
Never mention you are an AI. Answer in 1–3 sentences.`;

export const handler: Handler = async (evt) => {
  if (evt.httpMethod === 'OPTIONS') {
    return cors(200, '');
  }
  try {
    const { prompt } = JSON.parse(evt.body || '{}');

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        messages: [
          { role: 'system', content: SYS },
          { role: 'user', content: prompt?.toString().slice(0, 2000) || '' }
        ]
      })
    });

    if (!r.ok) throw new Error('groq unavailable');

    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Hmm, I'm stumped! Try another angle?";

    return cors(200, JSON.stringify({ reply }));
  } catch (e) {
    // Let the client drop to offline persona
    return cors(503, JSON.stringify({ error: 'offline' }));
  }
};

function cors(status: number, body: string) {
  return {
    statusCode: status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body
  };
}

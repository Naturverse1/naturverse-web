import type { Handler } from '@netlify/functions';

type Msg = { role: 'user' | 'assistant' | 'system'; content: string };

export const handler: Handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: cors(),
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors(), body: 'Method not allowed' };
  }

  try {
    const { messages, path } = JSON.parse(event.body ?? '{}') as {
      messages: Msg[];
      path?: string;
    };

    const last = Array.isArray(messages) ? messages[messages.length - 1] : null;
    const text = typeof last?.content === 'string' ? last.content.trim().toLowerCase() : '';
    const zone = zoneFromPath(path ?? '');

    const reply = route(text, zone);

    return {
      statusCode: 200,
      headers: { ...cors(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply }),
    };
  } catch (e: any) {
    return {
      statusCode: 400,
      headers: cors(),
      body: `Bad request: ${e?.message ?? e}`,
    };
  }
};

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function zoneFromPath(p: string) {
  if (p.startsWith('/naturversity')) return 'naturversity';
  if (p.startsWith('/marketplace')) return 'marketplace';
  if (p.startsWith('/navatar')) return 'navatar';
  if (p.startsWith('/zones')) return 'zones';
  if (p.startsWith('/worlds')) return 'worlds';
  return 'home';
}

function route(text: string, zone: string) {
  const base =
    zone === 'naturversity'
      ? 'Naturversity'
      : zone === 'marketplace'
      ? 'Marketplace'
      : zone === 'navatar'
      ? 'Navatar'
      : zone === 'zones'
      ? 'Zones'
      : zone === 'worlds'
      ? 'Worlds'
      : 'Home';

  if (/language|languages/.test(text)) return `Languages live in ${base} → Naturversity → Languages.`;
  if (/course|courses|class|classes/.test(text)) return `Courses are in ${base} → Naturversity → Courses (coming soon).`;
  if (/shop|buy|store|cart/.test(text)) return `Shop is in Marketplace → Shop.`;
  return `You're in ${base}. Ask me about "languages", "courses", or "shop".`;
}

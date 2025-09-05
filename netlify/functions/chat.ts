import type { Handler } from '@netlify/functions';

type Msg = { role:'user'|'assistant'; content:string };

const canned = {
  home:    'Welcome to The Naturverse! Try Worlds, Zones, or Marketplace from the top nav.',
  marketplace:
          'Marketplace: Shop (featured items), NFT/Mint, Specials, and Wishlist tabs.',
  naturversity:
          'Naturversity has Languages, Courses, Quizzes, and Music hubs.',
  navatar: 'Navatar: Create, Pick Your Navatar, or Upload/Edit.',
};

const handler: Handler = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: 'missing body' };
    const { zone, messages } = JSON.parse(event.body) as { zone?: string; messages?: Msg[] };

    const last = (messages ?? []).slice(-1)[0]?.content?.toLowerCase() || '';
    let reply = canned[(zone as keyof typeof canned) || 'home'];

    if (last.includes('language')) reply = 'Languages is in Naturversity → Languages.';
    if (last.includes('course'))   reply = 'Courses are in Naturversity → Courses.';
    if (last.includes('shop'))     reply = 'Open Marketplace → Shop tab.';
    if (last.includes('wishlist')) reply = 'Wishlist is a tab inside Marketplace.';

    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch {
    return { statusCode: 200, body: JSON.stringify({ reply: 'Sorry—something went wrong. Try again.' }) };
  }
};

export { handler };

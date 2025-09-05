import type { Handler } from '@netlify/functions';

type Msg = { role: 'user' | 'assistant'; content: string };

const canned = {
  home: 'Welcome to The Naturverse! Try Worlds, Zones, or Marketplace.',
  marketplace: 'Marketplace tabs: Shop, NFT/Mint, Specials, Wishlist.',
  naturversity: 'Naturversity: Languages, Courses, Quizzes, Music.',
  navatar: 'Navatar: Create, Pick, or Upload/Edit.',
};

export const handler: Handler = async (event) => {
  try {
    const { zone, messages } = JSON.parse(event.body ?? '{}') as {
      zone?: keyof typeof canned;
      messages?: Msg[];
    };

    const last = (messages ?? []).slice(-1)[0]?.content?.toLowerCase() || '';
    let reply = canned[zone ?? 'home'];
    if (last.includes('language')) reply = 'Naturversity → Languages.';
    if (last.includes('course'))   reply = 'Naturversity → Courses.';
    if (last.includes('shop'))     reply = 'Marketplace → Shop tab.';
    if (last.includes('wishlist')) reply = 'Marketplace → Wishlist tab.';

    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch {
    return { statusCode: 200, body: JSON.stringify({ reply: 'Sorry—something went wrong. Try again.' }) };
  }
};


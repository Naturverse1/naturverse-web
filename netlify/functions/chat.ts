import type { Handler } from '@netlify/functions';

type ChatMsg = { role: 'user'|'assistant'|'system'; content: string };
type Payload = { messages: ChatMsg[]; zone?: string };

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
};

const ZONE_DEMOS: Record<string,string> = {
  home: 'Hi! I\u2019m Turian. Try \u201cWhere is Marketplace?\u201d or \u201cHow do I create a Navatar?\u201d',
  naturversity: 'Naturversity has Languages, Courses, Quizzes, and Labs. Want a link to Languages?',
  marketplace: 'Marketplace has Shop (live), NFT/Mint, Specials, and Wishlist. Need the Shop link?',
  navatar: 'Navatar has Create, Pick Your Navatar, and Upload. Which one do you want to try?',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  }

  try {
    const body: Payload = JSON.parse(event.body || '{}');

    const last = body.messages?.slice(-1)[0]?.content?.toLowerCase() || '';
    const zone = (body.zone || 'home').toLowerCase();

    // Tiny rule-based demo so it always answers.
    let answer =
      ZONE_DEMOS[zone] ||
      'Hi! I\u2019m Turian. Ask me about The Naturverse, Marketplace, or Navatar.';

    if (last.includes('language')) {
      answer = 'Languages live in Naturversity \u2192 Languages. Want me to open Naturversity?';
    } else if (last.includes('course')) {
      answer = 'Courses are in Naturversity \u2192 Courses (coming soon).';
    } else if (last.includes('market') || last.includes('shop')) {
      answer = 'Head to Marketplace \u2192 Shop to see plush, tee, and sticker pack.';
    } else if (last.includes('navatar') || last.includes('avatar')) {
      answer = 'Go to Navatar. You can Create, Pick a Navatar, or Upload your own.';
    }

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json', ...cors },
      body: JSON.stringify({ ok: true, reply: answer }),
    };
  } catch (err: any) {
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json', ...cors },
      body: JSON.stringify({ ok: false, error: err?.message || 'Unknown error' }),
    };
  }
};
export default handler;

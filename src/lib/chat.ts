export type ChatMsg = { role: 'user' | 'assistant'; content: string };

const cannedByZone: Record<string, string> = {
  home: 'Welcome to The Naturverse! Try Worlds, Zones, or Marketplace from the top.',
  marketplace: 'Marketplace tabs: Shop (featured), NFT/Mint, Specials, Wishlist.',
  naturversity: 'Naturversity hubs: Languages, Courses, Quizzes, Music.',
  navatar: 'Navatar has Create, Pick Your Navatar, and Upload/Edit.',
};

export async function sendChat(history: ChatMsg[], zone: string): Promise<string> {
  // Try Netlify function first…
  try {
    const res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zone, messages: history }),
    });
    if (res.ok) {
      const data = await res.json();
      return String(data.reply ?? '');
    }
  } catch {
    /* fall through to local canned reply */
  }

  // …fallback so the demo *always* answers in previews or when functions aren’t available.
  const last = history.at(-1)?.content.toLowerCase() ?? '';
  let reply = cannedByZone[zone] ?? cannedByZone.home;
  if (last.includes('language')) reply = 'Languages is in Naturversity → Languages.';
  if (last.includes('course'))   reply = 'Courses are in Naturversity → Courses.';
  if (last.includes('shop'))     reply = 'Open Marketplace → Shop tab.';
  if (last.includes('wishlist')) reply = 'Wishlist is in Marketplace → Wishlist.';
  return reply;
}


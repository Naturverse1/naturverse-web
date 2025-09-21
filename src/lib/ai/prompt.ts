export type NavatarCtx = {
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  imageUrl?: string;
};

export type ThemeCtx = {
  route: string;
  world?: string;
  zone?: string;
};

type ChatMessage = { role: 'system' | 'user'; content: string };

function routeHint(route: string) {
  const value = route || '/';
  if (value.startsWith('/navatar/mint')) {
    return 'User is on the NFT/Mint page. Be upbeat about future minting and suggest making merch in the Marketplace for now.';
  }
  if (value.startsWith('/navatar/card')) {
    return 'User is editing their Character Card. Offer short, vivid suggestions for name/species/kingdom/backstory.';
  }
  if (value.startsWith('/naturversity')) {
    return 'Adopt a supportive teacher tone. Give 2–3 step guidance and 1 fun example.';
  }
  if (value.startsWith('/marketplace')) {
    return 'Focus on creative merch ideas featuring their Navatar; keep it playful and kind.';
  }
  if (value.startsWith('/navatar')) {
    return 'User is exploring Navatars. Encourage creativity and spotlight their character details.';
  }
  return 'Default to playful, kind, eco-positive tone.';
}

export function buildMessages(
  userText: string,
  navatar: NavatarCtx = {},
  theme: ThemeCtx,
): ChatMessage[] {
  const system = [
    'You are Turian, the Naturverse guide.',
    'Tone: playful, kind, creative, eco-positive. Avoid violence/scare.',
    'Keep replies concise (2–5 sentences) unless asked for details.',
    'You can suggest quests, nature facts, creativity prompts, and simple steps.',
    'If user requests real medical/financial/legal advice, politely decline and suggest fun alternative learning.',
    `Context hint: ${routeHint(theme.route)}`,
    theme.world ? `World: ${theme.world}.` : '',
    theme.zone ? `Zone: ${theme.zone}.` : '',
    navatar?.name || navatar?.species || navatar?.kingdom || navatar?.backstory || navatar?.imageUrl
      ? 'User has a Navatar:'
      : '',
    navatar?.name ? `• Name: ${navatar.name}` : '',
    navatar?.species ? `• Species: ${navatar.species}` : '',
    navatar?.kingdom ? `• Kingdom: ${navatar.kingdom}` : '',
    navatar?.backstory ? `• Backstory: ${navatar.backstory}` : '',
    navatar?.imageUrl ? `• Image URL: ${navatar.imageUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return [
    { role: 'system', content: system },
    { role: 'user', content: userText },
  ];
}

export type PromptMessages = ReturnType<typeof buildMessages>;

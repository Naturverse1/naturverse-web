const toPath = (slug: string) => {
  switch (slug) {
    case "home":
      return "/";
    case "zones":
      return "/zones";
    case "languages":
      return "/languages";
    case "music":
      return "/zones#music";
    case "arcade":
      return "/zones#arcade";
    case "wellness":
      return "/zones#wellness";
    case "creator-lab":
    case "creator":
    case "lab":
      return "/zones#creator-lab";
    case "stories":
      return "/zones#stories";
    case "marketplace":
    case "shop":
    case "store":
      return "/marketplace";
    case "worlds":
      return "/worlds";
    case "cart":
      return "/cart";
    case "profile":
    case "account":
      return "/account";
    default:
      return null;
  }
};

export function maybeNavigateFrom(input: string): string | null {
  if (!input) return null;
  // normalize
  const text = input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .trim();

  // common phrasings
  const targets = [
    "languages",
    "zones",
    "music",
    "arcade",
    "wellness",
    "creator-lab",
    "creator",
    "lab",
    "stories",
    "marketplace",
    "shop",
    "store",
    "worlds",
    "cart",
    "profile",
    "account",
    "home",
  ];

  for (const t of targets) {
    // match exact word in the sentence (e.g., "where is languages", "take me to music")
    const re = new RegExp(`\\b(${t.replace("-", "\\-")})\\b`);
    if (re.test(text)) {
      const path = toPath(t);
      if (path) return path;
    }
  }
  return null;
}


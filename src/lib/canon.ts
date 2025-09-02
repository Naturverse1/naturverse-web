export type Canon = { key: string; title: string; subtitle: string; file: string }

// Helper: URL for /public/navatars files (handles spaces)
export const canonSrc = (file: string) => `/navatars/${encodeURIComponent(file)}`

// Base canon (existing)
const BASE: Canon[] = [
  { key: 'bamboo',       title: 'Bamboo',        subtitle: 'plant · calm',   file: 'Bamboo.png' },
  { key: 'firefox',      title: 'Firefox',       subtitle: 'fox · red',      file: 'Firefox.png' },
  { key: 'ocean-orb',    title: 'Ocean Orb',     subtitle: 'ocean · blue',   file: 'Ocean Orb.png' },
  { key: 'seedling',     title: 'Seedling',      subtitle: 'growth · green', file: 'Seedling.png' },
  { key: 'splash',       title: 'Splash',        subtitle: 'water · fun',    file: 'Splash.png' },
  { key: 'zen-panda',    title: 'Zen Panda',     subtitle: 'panda · calm',   file: 'Zen Panda.png' },
]

// New canon you added (exact filenames from your screenshot)
const NEW_CANON: Canon[] = [
  { key: 'blu-butterfly',    title: 'Blu Butterfly',    subtitle: 'butterfly · blue', file: 'Blu Butterfly.png' },
  { key: 'coconut-cruze',    title: 'Coconut Cruze',    subtitle: 'island · chill',   file: 'Coconut Cruze.png' },
  { key: 'dr-p',             title: 'Dr P',             subtitle: 'mystery · smart',  file: 'Dr P.png' },
  { key: 'frankie-frogs',    title: 'Frankie Frogs',    subtitle: 'frogs · green',    file: 'Frankie Frogs.png' },
  { key: 'inkie',            title: 'Inkie',            subtitle: 'ink · curious',    file: 'Inkie.png' },
  { key: 'jen-suex',         title: 'Jen-Suex',         subtitle: 'hero · swift',     file: 'Jen-Suex.png' },
  { key: 'mango-mike',       title: 'Mango Mike',       subtitle: 'fruit · sunny',    file: 'Mango Mike.png' },
  { key: 'nikki-mt',         title: 'Nikki MT',         subtitle: 'style · cool',     file: 'Nikki MT.png' },
  { key: 'pineapple-petey',  title: 'Pineapple Petey',  subtitle: 'fruit · fun',      file: 'Pineapple Petey.png' },
  { key: 'teeyor',           title: 'Teeyor',           subtitle: 'friend · gentle',  file: 'Teeyor.png' },
  { key: 'hank',             title: 'Hank',             subtitle: 'buddy · bold',     file: 'hank.png' },
]

export const CANON_LIST: Canon[] = [...BASE, ...NEW_CANON]

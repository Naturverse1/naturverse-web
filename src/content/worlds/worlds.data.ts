import type { World } from '../../types/worlds';

// Asset helper: if a file is missing in /attached_assets, the UI
// will still render using emojis.
const a = (p: string) => `/attached_assets/${p}`;

export const worldsData: World[] = [
  {
    slug: 'thailandia',
    name: 'Thailandia',
    subtitle: 'Coconuts & Elephants',
    emojis: ['🐘','🥥'],
    status: 'available',
    map: a('thailandia/map.png'),
    banner: a('Backgrounds/thailandia-banner.jpg'),
    main: {
      id: 'turian',
      name: 'Turian',
      role: 'main',
      emoji: '🥭',
      image: a('named images/Turian.png')
    },
    cast: [
      { id: 'inkie', name: 'Inkie', role: 'support', emoji: '🖌️', image: a('thailandia/inkie.png'), zone: 'creator' },
      { id: 'dr-p', name: 'Dr. P', role: 'guide', emoji: '🧠', image: a('thailandia/dr-p.png'), zone: 'wellness' },
    ]
  },
  {
    slug: 'chilandia',
    name: 'Chinlandia',
    subtitle: 'Bamboo & Pandas',
    emojis: ['🐼','🎋'],
    status: 'available',
    map: a('Chilandiaassets/map.png'),
    banner: a('Backgrounds/chilandia-banner.jpg'),
    main: { id: 'bao', name: 'Bao', role: 'main', emoji: '🐼', image: a('Chilandiaassets/bao.png') },
    cast: [
      { id: 'li', name: 'Li', role: 'guide', emoji: '🎼', image: a('Chilandiaassets/li.png'), zone: 'music' },
    ]
  },
  {
    slug: 'indilandia',
    name: 'Indilandia',
    subtitle: 'Mangoes & Tigers',
    emojis: ['🐅','🥭'],
    status: 'available',
    map: a('Indilandiaassets/map.png'),
    banner: a('Backgrounds/indilandia-banner.jpg'),
    main: { id: 'mango-mike', name: 'Mango Mike', role: 'main', emoji: '🥭', image: a('Indilandiaassets/mango-mike.png') },
    cast: [
      { id: 'jay-sing', name: 'Jay-Sing', role: 'support', emoji: '🎤', image: a('Indilandiaassets/jay-sing.png'), zone: 'music' },
    ]
  },
  {
    slug: 'brazilandia',
    name: 'Brazilandia',
    subtitle: 'Bananas & Parrots',
    emojis: ['🦜','🍌'],
    status: 'available',
    map: a('Brazilandiaassets/map.png'),
    banner: a('Backgrounds/brazilandia-banner.jpg'),
    main: { id: 'frankie', name: 'Frankie Frogs', role: 'main', emoji: '🐸', image: a('Brazilandiaassets/frankie.png') },
    cast: [
      { id: 'jen-suex', name: 'Jen-Suex', role: 'guide', emoji: '🪘', image: a('Brazilandiaassets/jen-suex.png'), zone: 'music' },
    ]
  },
  {
    slug: 'amerilandia',
    name: 'Amerilandia',
    subtitle: 'Apples & Eagles',
    emojis: ['🦅','🍎'],
    status: 'available',
    map: a('Amerilandiaassets/map.png'),
    banner: a('Backgrounds/amerilandia-banner.jpg'),
    main: { id: 'nikki', name: 'Nikki MT', role: 'main', emoji: '🗽', image: a('Amerilandiaassets/nikki-mt.png') },
    cast: [
      { id: 'lao-cow', name: 'Lao Cow', role: 'support', emoji: '🐮', image: a('Amerilandiaassets/lao-cow.png'), zone: 'community' },
    ]
  },
  {
    slug: 'australandia',
    name: 'Australandia',
    subtitle: 'Peaches & Kangaroos',
    emojis: ['🦘','🍑'],
    status: 'available',
    map: a('Australandiaassets/map.png'),
    banner: a('Backgrounds/australandia-banner.jpg'),
    main: { id: 'coconut-cruze', name: 'Coconut Cruze', role: 'main', emoji: '🥥', image: a('Australandiaassets/coconut-cruze.png') },
    cast: [
      { id: 'non-bua', name: 'Non-Bua', role: 'guide', emoji: '🌿', image: a('Australandiaassets/non-bua.png'), zone: 'wellness' },
    ]
  },
  // Coming soon worlds
  {
    slug: 'japanthia',
    name: 'Japanthia',
    subtitle: 'Cherry Blossoms',
    emojis: ['🌸','🗾'],
    status: 'coming-soon',
    main: { id: 'japanthia-main', name: 'TBD', role: 'main' },
    cast: []
  },
  {
    slug: 'afrilandia',
    name: 'Afrilandia',
    subtitle: 'Mangoes & Lions',
    emojis: ['🦁','🥭'],
    status: 'coming-soon',
    main: { id: 'afrilandia-main', name: 'TBD', role: 'main' },
    cast: []
  },
  {
    slug: 'eurolandia',
    name: 'Eurolandia',
    subtitle: 'Sunflowers & Hedgehogs',
    emojis: ['🌻','🦔'],
    status: 'coming-soon',
    main: { id: 'eurolandia-main', name: 'TBD', role: 'main' },
    cast: []
  },
  {
    slug: 'britlandia',
    name: 'Britlandia',
    subtitle: 'Roses & Hedgehogs',
    emojis: ['🌹','🦔'],
    status: 'coming-soon',
    main: { id: 'britlandia-main', name: 'TBD', role: 'main' },
    cast: []
  },
  {
    slug: 'kiwilandia',
    name: 'Kiwilandia',
    subtitle: 'Kiwis & Sheep',
    emojis: ['🥝','🐑'],
    status: 'coming-soon',
    main: { id: 'kiwilandia-main', name: 'TBD', role: 'main' },
    cast: []
  },
  {
    slug: 'madagalandia',
    name: 'Madagalandia',
    subtitle: 'Lemons & Lemurs',
    emojis: ['🍋','🦝'],
    status: 'coming-soon',
    main: { id: 'madagalandia-main', name: 'TBD', role: 'main' },
    cast: []
  },
  {
    slug: 'greenlandia',
    name: 'Greenlandia',
    subtitle: 'Ice & Polar Bears',
    emojis: ['❄️','🐻‍❄️'],
    status: 'coming-soon',
    main: { id: 'greenlandia-main', name: 'TBD', role: 'main' },
    cast: []
  },
  {
    slug: 'antarctilandia',
    name: 'Antarctilandia',
    subtitle: 'Ice Crystals & Penguins',
    emojis: ['💎','🐧'],
    status: 'coming-soon',
    main: { id: 'antarctilandia-main', name: 'TBD', role: 'main' },
    cast: []
  }
];


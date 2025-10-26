import {
  NavatarRow,
  PassportStampRow,
  ProductRow,
  WishlistRow,
  XpLedgerRow,
} from './types'

export const ALL_KINGDOMS = [
  'thailandia',
  'amerilandia',
  'indillandia',
  'brazilandia',
  'australandia',
  'chilandia',
  'japonica',
  'africana',
  'europalia',
  'britannula',
  'kiwilandia',
  'madagascaria',
  'greenlandia',
  'antarctiland',
]

export const sampleStamps: PassportStampRow[] = [
  {
    id: 's1',
    owner_id: 'u1',
    kingdom: 'thailandia',
    stamped_at: new Date().toISOString(),
  },
  {
    id: 's2',
    owner_id: 'u1',
    kingdom: 'amerilandia',
    stamped_at: new Date().toISOString(),
  },
]

export const sampleXp: XpLedgerRow[] = [
  {
    id: 'x1',
    owner_id: 'u1',
    delta: 10,
    reason: 'welcome',
    created_at: new Date().toISOString(),
  },
  {
    id: 'x2',
    owner_id: 'u1',
    delta: 5,
    reason: 'quest',
    created_at: new Date(Date.now() - 3 * 864e5).toISOString(),
  },
]

export const sampleProducts: ProductRow[] = [
  {
    id: 'p1',
    slug: 'kiwi-cap',
    title: 'Kiwi Cap',
    price_cents: 1999,
    image_url: null,
    tags: ['headwear'],
    active: true,
  },
  {
    id: 'p2',
    slug: 'penguin-tee',
    title: 'Penguin Tee',
    price_cents: 2599,
    image_url: null,
    tags: ['tops'],
    active: true,
  },
]

export const sampleWishlist: WishlistRow[] = [
  {
    id: 'w1',
    owner_id: 'u1',
    product_id: 'p2',
    created_at: new Date().toISOString(),
  },
]

export const sampleNavatar: NavatarRow = {
  id: 'n1',
  owner_id: 'u1',
  user_id: 'u1',
  name: 'Macaw',
  base_type: 'animal',
  species: 'Macaw',
  powers: ['Puzzle Vision', 'Sunbeam Heal'],
  backstory: 'Explorer of the 14 kingdoms.',
  photo_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

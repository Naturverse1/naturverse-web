import {
  BadgeRow,
  CatalogItem,
  CatalogSection,
  Navatar,
  NavatarRow,
  PassportProgress,
  PassportStampRow,
  ProductRow,
  Profile,
  ProfileRow,
  WishlistItem,
  WishlistRow,
  XpLedgerRow,
  XpTotals,
} from './types'

/* Utilities */
const toDate = (iso?: string | null) => (iso ? new Date(iso) : new Date())
const dollars = (cents: number) => Math.round(cents) / 100

/* Profile */
export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    name: row.display_name ?? 'Explorer',
    email: row.email ?? undefined,
    avatar: row.photo_url ?? undefined,
    joinedAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  }
}

/* Navatar */
export function mapNavatarRow(row: NavatarRow): Navatar {
  return {
    id: row.id,
    ownerId: row.owner_id ?? row.user_id,
    name: row.name ?? 'Navatar',
    base: row.base_type,
    species: row.species ?? undefined,
    powers: row.powers ?? [],
    backstory: row.backstory ?? undefined,
    photo: row.photo_url ?? undefined,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  }
}

/* Passport progress */
export function mapStampRowsToProgress(
  rows: PassportStampRow[],
  allKingdoms: string[]
): PassportProgress {
  const stampedSet = new Set(rows.map(r => r.kingdom))
  const stamped = allKingdoms.filter(k => stampedSet.has(k))
  const count = stamped.length
  const total = allKingdoms.length || 1
  return {
    totalKingdoms: total,
    stamped,
    count,
    percent: Math.round((count / total) * 100),
  }
}

/* XP aggregation */
export function mapXpRowsToTotals(rows: XpLedgerRow[], now = new Date()): XpTotals {
  const midnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const startToday = midnight(now).getTime()
  const start7 = new Date(now.getTime() - 6 * 24 * 3600 * 1000).getTime() // inclusive of today

  let total = 0,
    today = 0,
    last7d = 0
  for (const r of rows) {
    const t = new Date(r.created_at).getTime()
    total += r.delta
    if (t >= startToday) today += r.delta
    if (t >= start7) last7d += r.delta
  }
  return { total, today, last7d }
}

/* Catalog & wishlist */
export function mapProductRow(row: ProductRow): CatalogItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    price: dollars(row.price_cents),
    image: row.image_url ?? undefined,
    tags: row.tags ?? [],
  }
}

export function mapProductsToSections(
  rows: ProductRow[],
  tagOrder: string[] = []
): CatalogSection[] {
  const items = rows.filter(r => r.active).map(mapProductRow)
  if (!tagOrder.length) return [{ title: 'All', items }]
  const byTag = new Map<string, CatalogItem[]>()
  for (const t of tagOrder) byTag.set(t, [])
  for (const it of items) {
    const tag = it.tags.find(t => byTag.has(t)) ?? 'All'
    if (!byTag.has(tag)) byTag.set(tag, [])
    byTag.get(tag)!.push(it)
  }
  return Array.from(byTag.entries()).map(([title, items]) => ({ title, items }))
}

export function mapWishlistJoin(
  wishlist: WishlistRow[],
  products: ProductRow[]
): WishlistItem[] {
  const byId = new Map(products.map(p => [p.id, p]))
  return wishlist
    .map(w => {
      const p = byId.get(w.product_id)
      if (!p || !p.active) return null
      const base = mapProductRow(p)
      return { ...base, wishedAt: toDate(w.created_at) }
    })
    .filter((x): x is WishlistItem => Boolean(x))
}

/* Badges (simple pass-through to keep surface consistent) */
export function mapBadgeRows(rows: BadgeRow[]) {
  return rows.map(b => ({ ...b }))
}

// Core DB row shapes (what Supabase returns)
export type ProfileRow = {
  id: string; // uuid
  display_name: string | null;
  email: string | null;
  photo_url: string | null;
  created_at: string; // ISO
  updated_at: string; // ISO
};

export type NavatarRow = {
  id: string;
  owner_id: string;
  name: string | null;
  base_type: 'animal' | 'fruit' | 'insect' | 'spirit';
  species: string | null;
  powers: string[] | null;
  backstory: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type PassportStampRow = {
  id: string;
  owner_id: string;
  kingdom: string;
  stamped_at: string;
};

export type BadgeRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string | null;
};

export type XpLedgerRow = {
  id: string;
  owner_id: string;
  delta: number;
  reason: string;
  created_at: string;
};

export type ProductRow = {
  id: string;
  slug: string;
  title: string;
  price_cents: number;
  image_url: string | null;
  tags: string[] | null;
  active: boolean;
};

export type WishlistRow = {
  id: string;
  owner_id: string;
  product_id: string;
  created_at: string;
};

// UI models (what components expect)
export type Profile = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  joinedAt: Date;
  updatedAt: Date;
};

export type Navatar = {
  id: string;
  ownerId: string;
  name: string;
  base: NavatarRow['base_type'];
  species?: string;
  powers: string[];
  backstory?: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PassportProgress = {
  totalKingdoms: number;
  stamped: string[]; // kingdom slugs
  count: number;
  percent: number; // 0–100
};

export type XpTotals = {
  total: number;
  today: number;
  last7d: number;
};

export type CatalogItem = {
  id: string;
  slug: string;
  title: string;
  price: number; // in dollars
  image?: string;
  tags: string[];
};

export type CatalogSection = {
  title: string;
  items: CatalogItem[];
};

export type WishlistItem = CatalogItem & {
  wishedAt: Date;
};

export type NavatarCardRow = {
  id: string;
  owner_id: string;
  navatar_id: string | null;
  name: string | null;
  species: string | null;
  kingdom: string | null;
  backstory: string | null;
  powers: string[] | null;
  traits: string[] | null;
  created_at: string;
  updated_at: string;
};

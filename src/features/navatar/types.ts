export type NavatarCategory = 'animal' | 'fruit' | 'insect' | 'spirit' | 'other';

export interface NavatarRow {
  id: string;
  user_id: string;
  name: string | null;
  category: string | null;
  image_url: string | null;
  backstory?: string | null;
  created_at: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  category: NavatarCategory;
  image: string;     // path in /public
  tags?: string[];
}

export interface CatalogManifest {
  version: number;
  items: CatalogItem[];
}

export type ZoneKey = 'music' | 'wellness' | 'creator' | 'community' | 'teachers' | 'partners' | 'naturversity' | 'parents';

export interface Character {
  id: string;
  name: string;
  role: 'main' | 'guide' | 'support';
  emoji?: string;
  image?: string; // path in /attached_assets
  zone?: ZoneKey;
}

export interface World {
  slug: string;
  name: string;
  subtitle: string;           // “Coconuts & Elephants”
  emojis: string[];           // quick icons
  status: 'available' | 'coming-soon';
  map?: string;               // map asset path
  banner?: string;            // background/banner
  main: Character;            // main character (e.g., Turian)
  cast: Character[];          // supporting cast
}


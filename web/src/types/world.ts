export type WorldStatus = 'available' | 'coming_soon';

export interface World {
  slug: string;
  name: string;
  tagline: string;
  fruit: string;
  animal: string;
  region: string;
  status: WorldStatus;
  emoji?: string;
  image?: string; // optional cover if provided (e.g., /assets/worlds/<slug>/cover.png)
}


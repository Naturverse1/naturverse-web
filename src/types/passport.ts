export type PassportStamp = {
  id: string;
  user_id: string;
  world: string;        // e.g., "Thailandia"
  badge?: string | null; // e.g., "Explorer", "Helper"
  note?: string | null;
  created_at: string | null;
};

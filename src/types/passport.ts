export type PassportStamp = {
  id: string;
  user_id: string;
  world: string;        // e.g., "thailandia"
  title: string;        // e.g., "Temple Explorer"
  note?: string | null;
  created_at: string | null;
};

export type PassportBadge = {
  id: string;
  user_id: string;
  code: string;         // e.g., "10-quests", "quiz-master"
  label: string;        // display name
  created_at: string | null;
};

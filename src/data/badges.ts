export const BADGES = {
  FIRST_QUEST: { code: "FIRST_QUEST", label: "First Quest" },
  STREAK_3: { code: "STREAK_3", label: "3-Day Streak" },
  STREAK_7: { code: "STREAK_7", label: "7-Day Streak" },
  STREAK_30: { code: "STREAK_30", label: "30-Day Streak" }
} as const;
export type BadgeCode = keyof typeof BADGES;

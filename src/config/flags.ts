export const FLAGS = {
  ENABLE_GAMIFICATION: (import.meta.env.VITE_ENABLE_GAMIFICATION ?? 'false') === 'true',
  ENABLE_LEADERBOARD:  (import.meta.env.VITE_ENABLE_LEADERBOARD ?? 'false') === 'true',
  ENABLE_STREAKS:      (import.meta.env.VITE_ENABLE_STREAKS ?? 'false') === 'true',
};

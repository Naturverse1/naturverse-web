# DB query helpers

- Profiles: `getProfile`, `updateProfile`
- Navatars: `createNavatar`, `getNavatarsByUser`
- Stamps: `awardStamp`, `getStamps`
- XP: `addXp`, `getXpTotal`, `getXpHistory`
- Badges: `awardBadge`, `getBadges`

### Quizzes
- `createQuiz({ title, description?, world_slug?, zone_slug?, difficulty?, is_published? })`
- `getQuiz(quizId)` → `{ quiz, questions }`
- `submitQuizAttempt({ user_id, quiz_id, score, max_score, duration_ms?, detail? })`
- `getUserQuizAttempts(userId)`
- `getLeaderboard(quizId, limit?)`

### Feedback
- `submitFeedback({ user_id?, category, message, page_path?, meta? })`
- `listFeedback({ userId? })`

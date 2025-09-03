# Naturverse Web

## Environment

Create a `.env` at repo root:

OPENAI_API_KEY=sk-…
VITE_SUPABASE_URL=…
VITE_SUPABASE_ANON_KEY=…
SUPABASE_SERVICE_ROLE_KEY=…
IMAGES_BUCKET=avatars

Also set the same variables in Netlify → Site settings → Environment variables.

### NaturBank
- Page: `/naturbank`
- Demo wallet label/address; NATUR balance computed from transactions; grant/spend buttons.
- LocalStorage fallback when not signed in.
- To enable server persistence: run `supabase/sql/2025-naturbank.sql`.

### Passport
- Page: `/passport`
- Stamps per world + badges; demo buttons to add local/server-backed progress.
- To persist in Supabase: run `supabase/sql/2025-passport.sql`.

# Naturverse Web

## Environment

Create a `.env` at repo root:

OPENAI_API_KEY=sk-…
VITE_SUPABASE_URL=…
VITE_SUPABASE_ANON_KEY=…

Also set the same variables in Netlify → Site settings → Environment variables.

### NaturBank
- Page: `/naturbank`
- Demo wallet label/address; NATUR balance computed from transactions; grant/spend buttons.
- LocalStorage fallback when not signed in.
- To enable server persistence: run `supabase/sql/2025-naturbank.sql`.

### Passport
- Page: `/passport`
- Works offline via localStorage, and syncs to Supabase when signed in.
- Run SQL in `supabase/sql/2025-passport.sql` to enable server storage.

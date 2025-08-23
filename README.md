# Naturverse Web

## Environment

Create a `.env` at repo root:

OPENAI_API_KEY=sk-…
VITE_SUPABASE_URL=…
VITE_SUPABASE_ANON_KEY=…

Also set the same variables in Netlify → Site settings → Environment variables.

### NaturBank (demo)
- Works without servers (localStorage) OR with Supabase tables if present.
- Page: `/naturbank`
- To enable server sync, run SQL in `supabase/sql/2025-setup-naturbank.sql`.

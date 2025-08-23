# Supabase setup (30 sec)
1) In Supabase Studio → SQL editor → run, in order:
   - `supabase/schema.sql`
   - `supabase/storage-policies.sql`
   - `supabase/seed.sql`
2) Confirm:
   - `natur.profiles` exists; RLS enabled.
   - Buckets `avatars`, `navatars` are public read; you can write to `<userId>/...`.
3) App can keep using local-only demo until we wire the client.

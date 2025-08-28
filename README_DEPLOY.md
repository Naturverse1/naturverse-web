# Deployment Quickstart

This guide helps you deploy Naturverse with Netlify and Supabase.

## Netlify

1. Create a Netlify site and link it to this repository.
2. In **Site settings → Environment variables**, define:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for serverless functions)
3. Deploy. Ensure these values are set before triggering a build.

## Supabase

1. Create a project at [Supabase](https://supabase.com/).
2. Under **Project settings → API**, copy the project URL and anon key.
3. Paste these values into Netlify's environment variables.

That's it — push to main to trigger future deploys.

## Deploy flags

### Toggle PWA
Set in Netlify → Site settings → Build & deploy → Environment variables

- `VITE_ENABLE_PWA=true`  → enable service worker registration + install prompt
- `VITE_ENABLE_PWA=false` → disable SW registration and hide install prompt

**Default:** false (safer). Turn on only after verifying no offline-caching regressions.

# Deployment Quickstart

This guide helps you deploy Naturverse with Netlify and Supabase.

## Netlify

1. Create a Netlify site and link it to this repository.
2. In **Site settings → Environment variables**, define:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Deploy. The build will fail early if any of these values are missing.

## Supabase

1. Create a project at [Supabase](https://supabase.com/).
2. Under **Project settings → API**, copy the project URL and anon key.
3. Paste these values into Netlify's environment variables.

That's it — push to main to trigger future deploys.

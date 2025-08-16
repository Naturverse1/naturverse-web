## PR Checklist

- [ ] `npm test`
- [ ] `node -e "process.exit(!(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) ? 1 : 0)"`

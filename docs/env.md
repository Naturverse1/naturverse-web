# Environment configuration

The Vite client only reads variables that start with `VITE_`. Make sure to define the following in Netlify (and your local `.env` file when developing):

```bash
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

Server-side Netlify Functions can read any variables you add. Common values are:

```bash
GROQ_API_KEY=<turian api key>
SUPABASE_SERVICE_KEY=<service role key, only if a function needs it>
```

## Supabase dashboard

Update the Supabase auth redirect configuration so both production and deploy previews work:

1. In **Authentication → URL Configuration**, set **Site URL** to your production domain.
2. Add the following redirect URLs:

   ```
   https://*--naturverse-web.netlify.app/*
   https://naturverse-web.netlify.app/*
   https://<your-prod-domain>/*
   ```

3. Save the settings.

If you use the SQL editor to create the Navatar tables, remember to run the provided migration script so the triggers and RLS policies stay in sync.

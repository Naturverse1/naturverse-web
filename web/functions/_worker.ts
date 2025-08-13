import { createClient } from '@supabase/supabase-js';
import { Hono } from 'hono';

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SUPABASE_ANON_KEY: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/api/health', (c) => {
  return c.json({ ok: true, time: new Date().toISOString() });
});

app.get('/api/observations', async (c) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  // Optional: adjust table name later; for now just prove connectivity with a cheap call
  return c.json({ ok: true });
});

export default app;

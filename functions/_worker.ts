import { createClient } from '@supabase/supabase-js';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors());

app.use('*', async (c, next) => {
  console.log('REQ', c.req.method, c.req.path);
  try {
    await next();
  } catch (e: any) {
    console.error('Worker error:', e?.message || e);
    return c.json({ ok: false, error: String(e?.message || e) }, 500);
  }
});

app.get('/api/health', (c) => c.json({ ok: true, time: new Date().toISOString() }));

function sb(c: any) {
  return createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

app.get('/api/observations', async (c) => {
  const { data, error } = await sb(c)
    .from('observations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return c.json({ ok: false, error: error.message }, 500);
  return c.json({ ok: true, data });
});

app.post('/api/observations', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { title, description } = body ?? {};
  if (!title) return c.json({ ok: false, error: 'title required' }, 400);
  const { data, error } = await sb(c)
    .from('observations')
    .insert([{ title, description: description ?? null }])
    .select()
    .single();
  if (error) return c.json({ ok: false, error: error.message }, 500);
  return c.json({ ok: true, data });
});

export default app;

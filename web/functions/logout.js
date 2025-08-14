import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function onRequest(context) {
  const { request } = context;
  const method = request.method;
  console.log(`[logout] ${method} ${request.url}`);
  try {
    if (method === 'POST') {
      // Log out the user (invalidate session)
      const { error } = await supabase.auth.signOut();
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  } catch (err) {
    console.error('[logout] Exception:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function onRequest(context) {
  const { request } = context;
  const method = request.method;

  if (method === 'POST') {
    const body = await request.json();
    const { email, password, type } = body;
    if (!email || !password || !type) {
      return new Response(JSON.stringify({ error: 'Missing email, password, or type' }), { status: 400 });
    }
    if (type === 'signIn') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 401 });
      return new Response(JSON.stringify({ data }), { headers: { 'Content-Type': 'application/json' } });
    }
    if (type === 'signUp') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      return new Response(JSON.stringify({ data }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ error: 'Invalid type' }), { status: 400 });
  }

  return new Response('Not found', { status: 404 });
}

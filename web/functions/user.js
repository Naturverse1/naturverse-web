import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function onRequest(context) {
  const { request } = context;
  const method = request.method;

  if (method === 'GET') {
    // Get user info by id (from query param)
    const url = new URL(request.url);
    const user_id = url.searchParams.get('user_id');
    if (!user_id) return new Response(JSON.stringify({ error: 'Missing user_id' }), { status: 400 });
    const { data, error } = await supabase.from('users').select('*').eq('id', user_id).single();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return new Response(JSON.stringify({ data }), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response('Not found', { status: 404 });
}

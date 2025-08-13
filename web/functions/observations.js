import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'GET') {
    // Get all observations for the user (user_id from query param for demo)
    const user_id = url.searchParams.get('user_id');
    if (!user_id) return new Response(JSON.stringify({ error: 'Missing user_id' }), { status: 400 });
    const { data, error } = await supabase
      .from('observations')
      .select('id, title, description, user_id, created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return new Response(JSON.stringify({ data }), { headers: { 'Content-Type': 'application/json' } });
  }

  if (method === 'POST') {
    const body = await request.json();
    const { title, description, user_id } = body;
    if (!title || !user_id) return new Response(JSON.stringify({ error: 'Missing title or user_id' }), { status: 400 });
    const { error } = await supabase.from('observations').insert([{ title, description, user_id }]);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  if (method === 'DELETE') {
    const body = await request.json();
    const { id, user_id } = body;
    if (!id || !user_id) return new Response(JSON.stringify({ error: 'Missing id or user_id' }), { status: 400 });
    const { error } = await supabase.from('observations').delete().eq('id', id).eq('user_id', user_id);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
  }

  return new Response('Not found', { status: 404 });
}

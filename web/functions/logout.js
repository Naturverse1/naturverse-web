
import { createClient } from '@supabase/supabase-js';

export async function onRequestPost({ request, env, params, next, data }) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  // Log out the user (invalidate session)
  const { error } = await supabase.auth.signOut();
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}

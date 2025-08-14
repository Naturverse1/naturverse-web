
import { createClient } from '@supabase/supabase-js';

export async function onRequest({ request, env, params, next, data }) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  return new Response(JSON.stringify({ items: [] }), {
    headers: { "content-type": "application/json" },
  });
}

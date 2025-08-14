
import { createClient } from '@supabase/supabase-js';

export async function onRequest({ request, env, params, next, data }) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  // unauth placeholder
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
}

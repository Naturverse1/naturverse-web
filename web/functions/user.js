
import { createClient } from '@supabase/supabase-js';

export async function onRequestGet({ request, env, params, next, data }) {
  const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
  // unauth placeholder
  return new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
}

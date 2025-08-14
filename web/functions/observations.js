
import { createClient } from '@supabase/supabase-js';

export async function onRequestGet({ request, env, params, next, data }) {
  const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
  return new Response(JSON.stringify({ items: [] }), {
    headers: { "content-type": "application/json" },
  });
}

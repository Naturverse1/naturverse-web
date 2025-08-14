
import { createClient } from '@supabase/supabase-js';

export async function onRequestPost({ request, env, params, next, data }) {
  const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
  // TODO: implement real auth
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
}

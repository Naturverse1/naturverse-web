import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function onRequestGet(ctx) {
  return new Response(JSON.stringify({ items: [] }), {
    headers: { "content-type": "application/json" },
  });
}
